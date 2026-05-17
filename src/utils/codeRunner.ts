export interface CodeBundle {
  html: string
  css: string
  js: string
  runId: string
}

/** Prevent </script> / </style> from breaking the enclosing tags */
function escapeCss(css: string): string {
  return css.replace(/<\/style(\s*>)/gi, '<\\/style$1')
}

function escapeJs(js: string): string {
  return js.replace(/<\/script(\s*>)/gi, '<\\/script$1')
}

/**
 * Builds a full HTML document suitable for use as `iframe.srcdoc`.
 *
 * Security guarantees:
 *  - Runs inside sandbox="allow-scripts" only (no allow-same-origin).
 *  - All communication back to parent is via postMessage tagged with runId.
 *  - The parent validates runId so rogue frames can't inject messages.
 *  - User HTML goes directly in <body> (intentional — students write HTML).
 *  - </style> and </script> in user code are escaped to prevent tag injection.
 */
export function buildSrcdoc(bundle: CodeBundle): string {
  const safeCss = escapeCss(bundle.css)
  const safeJs = escapeJs(bundle.js)
  const rid = JSON.stringify(bundle.runId) // safely quoted string literal

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; frame-src 'none';">
<style>
*{box-sizing:border-box}
body{margin:0;padding:8px;font-family:system-ui,sans-serif;line-height:1.5}
${safeCss}
</style>
<script>
(function(){
  var RID=${rid};
  function post(d){try{parent.postMessage(Object.assign({},d,{runId:RID}),'*')}catch(e){}}

  /* ── Console interception ──────────────────────────────────────────────── */
  var _orig={};
  ['log','warn','info','error'].forEach(function(lv){
    _orig[lv]=console[lv].bind(console);
    console[lv]=function(){
      var args=Array.prototype.slice.call(arguments).map(function(x){
        if(x===null) return 'null';
        if(x===undefined) return 'undefined';
        try{ return typeof x==='object'?JSON.stringify(x,null,2):String(x); }
        catch(e){ return String(x); }
      });
      _orig[lv].apply(console,arguments);
      post({type:'console',level:lv,args:args});
    };
  });

  /* ── Runtime error capture ─────────────────────────────────────────────── */
  window.onerror=function(msg,src,line,col,err){
    post({
      type:'error',
      errorType:err&&err.constructor?err.constructor.name:'Error',
      message:String(msg).replace(/^[A-Za-z]*Error:\\s*/,''),
      rawMessage:String(msg),
      lineno:line,
      colno:col
    });
    return true;
  };
  window.addEventListener('unhandledrejection',function(ev){
    var r=ev.reason;
    post({
      type:'error',
      errorType:'UnhandledPromiseRejection',
      message:r?(r.message||String(r)):'Promise rejected',
      rawMessage:String(r)
    });
  });
})();
<\/script>
</head>
<body>
${bundle.html}
<script>
(function(){
  var RID=${rid};
  function post(d){try{parent.postMessage(Object.assign({},d,{runId:RID}),'*')}catch(e){}}
  try{
    ${safeJs}
  }catch(e){}
  /* Signal that synchronous user JS has finished (used for loop-timeout reset) */
  post({type:'script-done'});
})();
<\/script>
</body>
</html>`
}

// ─── Code Task Runner ─────────────────────────────────────────────────────────

export interface CodeTaskCode {
  html: string
  css: string
  js: string
}

export interface CodeTaskTest {
  id: string
  description: string
  /** JS expression evaluated in sandbox: truthy = pass.
   *  Available globals: document, getComputedStyle, _logs (string[]), _lastLog (string|null) */
  check: string
}

export interface CodeTaskResult {
  id: string
  description: string
  passed: boolean
  error?: string
}

/**
 * Run student code in a hidden sandbox iframe and evaluate each test case.
 *
 * Test checks have access to:
 *   - Full DOM (document.querySelector, getComputedStyle, …)
 *   - _logs   — array of all console.log() outputs as strings
 *   - _lastLog — last console.log() output (or null)
 *
 * Returns a result per test case. Resolves after all tests finish or timeout.
 */
export function runCodeTask(
  code: CodeTaskCode,
  tests: CodeTaskTest[],
  timeoutMs = 6000
): Promise<CodeTaskResult[]> {
  if (tests.length === 0) return Promise.resolve([])

  return new Promise((resolve) => {
    const runId = Math.random().toString(36).slice(2)
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;left:-9999px;top:-9999px;visibility:hidden;'
    iframe.setAttribute('sandbox', 'allow-scripts')
    document.body.appendChild(iframe)

    let timer: ReturnType<typeof setTimeout> | null = null

    function cleanup() {
      if (timer) clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      try { document.body.removeChild(iframe) } catch { /* already removed */ }
    }

    function onMessage(ev: MessageEvent) {
      if (ev.source !== iframe.contentWindow) return
      const d = ev.data
      if (!d || typeof d !== 'object' || d.runId !== runId || d.type !== 'code-test-results') return
      cleanup()
      resolve(d.results as CodeTaskResult[])
    }

    window.addEventListener('message', onMessage)

    timer = setTimeout(() => {
      cleanup()
      resolve(tests.map((t) => ({ id: t.id, description: t.description, passed: false, error: 'Timeout' })))
    }, timeoutMs)

    const safeCss = escapeCss(code.css)
    const safeJs = escapeJs(code.js)
    const rid = JSON.stringify(runId)
    // Escape </script in the JSON payload too
    const testsJson = JSON.stringify(tests).replace(/<\/script/gi, '<\\/script')

    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; frame-src 'none';">
<style>*{box-sizing:border-box}body{margin:0;padding:8px;font-family:system-ui,sans-serif;line-height:1.5}
${safeCss}
</style>
</head>
<body>
${code.html}
<script>
var _RID = ${rid};
var _logs = [];
var _origLog = console.log.bind(console);
console.log = function() {
  var s = Array.prototype.slice.call(arguments).map(function(x) {
    try { return typeof x === 'object' ? JSON.stringify(x) : String(x); } catch(e) { return String(x); }
  }).join(' ');
  _logs.push(s);
  _origLog.apply(console, arguments);
};
try {
  ${safeJs}
} catch(_e) {}
var _lastLog = _logs.length > 0 ? _logs[_logs.length - 1] : null;
var _tests = ${testsJson};
var _results = _tests.map(function(t) {
  try {
    var _passed = eval(t.check);
    return { id: t.id, description: t.description, passed: !!_passed };
  } catch(_err) {
    return { id: t.id, description: t.description, passed: false, error: _err && _err.message ? _err.message : String(_err) };
  }
});
try { parent.postMessage({ type: 'code-test-results', runId: _RID, results: _results }, '*'); } catch(_e) {}
<\/script>
</body>
</html>`
  })
}
