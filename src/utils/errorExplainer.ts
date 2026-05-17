export interface ErrorInfo {
  type: string
  errorType?: string
  message: string
  rawMessage?: string
  lineno?: number
  colno?: number
}

interface LangExplanation {
  title: string
  explanation: string
  tip: string
}

export interface ErrorExplanation {
  ru: LangExplanation
  en: LangExplanation
}

function extractName(message: string): string {
  const m = message.match(/['"]?(\w+)['"]?\s+is not defined/)
  return m ? m[1] : 'переменная'
}

export function explainError(error: ErrorInfo): ErrorExplanation {
  const type = error.errorType ?? error.type ?? ''
  const msg = (error.rawMessage ?? error.message ?? '').toLowerCase()
  const lineHint = error.lineno ? ` (строка ${error.lineno})` : ''

  // ── CodeTestFailed (code_task test case failure) ─────────────────────────
  if (type === 'CodeTestFailed') {
    return {
      ru: {
        title: 'Тест не пройден',
        explanation:
          'Твой код запустился, но ожидаемое условие не выполнилось. ' +
          'Прочитай описание теста — там написано, что именно должен делать твой код.',
        tip: 'Попробуй запустить код вручную и посмотреть на вывод. Убедись, что результат совпадает с ожидаемым.',
      },
      en: {
        title: 'Test not passed',
        explanation:
          'Your code ran, but the expected condition was not met. ' +
          'Read the test description carefully — it tells you exactly what your code should do.',
        tip: 'Try running your code manually and inspect the output. Make sure the result matches what is expected.',
      },
    }
  }

  // ── InfiniteLoop (custom sentinel) ───────────────────────────────────────
  if (type === 'InfiniteLoop') {
    return {
      ru: {
        title: 'Похоже, бесконечный цикл',
        explanation:
          'Не переживай! Твой код работает уже слишком долго — скорее всего, цикл никогда не завершается.',
        tip: 'Проверь условие в while или for: счётчик должен изменяться, чтобы цикл когда-нибудь закончился.',
      },
      en: {
        title: 'Looks like an infinite loop',
        explanation:
          "Don't worry! Your code has been running for too long — most likely a loop never ends.",
        tip: 'Check the while or for condition: the counter must change so the loop eventually stops.',
      },
    }
  }

  // ── ReferenceError ────────────────────────────────────────────────────────
  if (type === 'ReferenceError' || msg.includes('is not defined')) {
    const name = extractName(error.rawMessage ?? error.message)
    return {
      ru: {
        title: `Переменная не найдена${lineHint}`,
        explanation: `Не переживай, это очень частая ошибка! Ты используешь «${name}», но нигде его не создал(а). JavaScript просто не знает такого имени.`,
        tip: `Проверь: объявил(а) ли ты «${name}» с помощью let, const или var? Может, опечатка в названии?`,
      },
      en: {
        title: `Variable not found${lineHint}`,
        explanation: `Don't worry, this happens all the time! You're using "${name}", but it was never created. JavaScript simply doesn't know that name.`,
        tip: `Check: did you declare "${name}" with let, const, or var? Maybe there's a typo?`,
      },
    }
  }

  // ── SyntaxError ───────────────────────────────────────────────────────────
  if (type === 'SyntaxError') {
    const hasUnexpected = msg.includes('unexpected') || msg.includes('unexpected token')
    const hasEnd = msg.includes('unexpected end') || msg.includes('unterminated')
    return {
      ru: {
        title: `Ошибка синтаксиса${lineHint}`,
        explanation:
          'Не переживай! Браузер не смог прочитать твой код — где-то опечатка или нарушена структура. Это как грамматическая ошибка в предложении.',
        tip: hasEnd
          ? 'Возможно, ты не закрыл(а) скобку (), [], {} или кавычку " \' `. Проверь в конце файла.'
          : hasUnexpected
            ? 'Найди строку с ошибкой и проверь: все ли скобки закрыты, правильно ли расставлены кавычки, нет ли лишней запятой?'
            : 'Внимательно посмотри на строку рядом с ошибкой — проверь скобки, кавычки и точки с запятой.',
      },
      en: {
        title: `Syntax error${lineHint}`,
        explanation:
          "Don't worry! The browser couldn't read your code — there's a typo or structural issue. Like a grammar mistake in a sentence.",
        tip: hasEnd
          ? 'You may have forgotten to close a bracket (), [], {} or quote " \' `. Check the end of the file.'
          : hasUnexpected
            ? 'Find the error line and check: are all brackets closed, are quotes matched, any extra commas?'
            : 'Look carefully near the error line — check brackets, quotes, and semicolons.',
      },
    }
  }

  // ── TypeError ─────────────────────────────────────────────────────────────
  if (type === 'TypeError') {
    const isNull = msg.includes('null') || msg.includes('undefined') || msg.includes('cannot read')
    const notFn = msg.includes('is not a function') || msg.includes('not a function')
    return {
      ru: {
        title: `Ошибка типа${lineHint}`,
        explanation: isNull
          ? 'Не переживай! Ты пытаешься использовать переменную, которая пока «пустая» (null или undefined). Это как пытаться открыть ящик, которого не существует.'
          : notFn
            ? 'Ты пытаешься вызвать что-то как функцию, но это не функция. Например, написал(а) foo() вместо foo.'
            : 'Что-то используется не по назначению — операция не подходит для этого типа данных.',
        tip: isNull
          ? 'Убедись, что переменная содержит значение прежде чем её использовать. Может, она не была установлена?'
          : notFn
            ? 'Проверь: правильно ли написано название функции и существует ли она вообще?'
            : 'Посмотри на типы данных (число, строка, массив, объект) и убедись, что операция им подходит.',
      },
      en: {
        title: `Type error${lineHint}`,
        explanation: isNull
          ? "Don't worry! You're trying to use a variable that is empty (null or undefined). It's like trying to open a box that doesn't exist."
          : notFn
            ? "You're calling something as a function, but it isn't one. For example, you wrote foo() instead of foo."
            : "Something is being used the wrong way — the operation doesn't fit this type of data.",
        tip: isNull
          ? "Make sure the variable has a value before using it. Maybe it was never set?"
          : notFn
            ? "Check: is the function name spelled correctly, and does it actually exist?"
            : "Look at the data types (number, string, array, object) and make sure the operation fits.",
      },
    }
  }

  // ── RangeError ────────────────────────────────────────────────────────────
  if (type === 'RangeError') {
    const isStack = msg.includes('maximum call stack') || msg.includes('stack overflow')
    return {
      ru: {
        title: `Ошибка диапазона${lineHint}`,
        explanation: isStack
          ? 'Не переживай! Функция вызывает саму себя слишком много раз — это называется бесконечная рекурсия. Браузер остановил выполнение.'
          : 'Ты вышел(а) за допустимые пределы — например, создал(а) слишком большой массив или передал(а) недопустимое число.',
        tip: isStack
          ? 'Проверь: не вызывает ли функция саму себя без условия остановки?'
          : 'Проверь числа, которые ты передаёшь — одно из них может быть слишком большим или отрицательным.',
      },
      en: {
        title: `Range error${lineHint}`,
        explanation: isStack
          ? "Don't worry! A function is calling itself too many times — this is called infinite recursion. The browser stopped it."
          : "You went beyond the allowed range — maybe you created an array that's too large or passed an invalid number.",
        tip: isStack
          ? "Check: is your function calling itself without a stop condition?"
          : "Check the numbers you're passing — one of them might be too large or negative.",
      },
    }
  }

  // ── HTML tag error (custom sentinel from parent) ──────────────────────────
  if (type === 'HTMLError') {
    return {
      ru: {
        title: 'Проблема в HTML',
        explanation:
          'Не переживай! В HTML что-то написано неверно — возможно, тег не закрыт или написан с опечаткой.',
        tip: 'Проверь: каждый открывающий тег <div> должен иметь закрывающий </div>. Теги нечувствительны к регистру, но должны быть написаны правильно: <p>, а не <para>.',
      },
      en: {
        title: 'HTML problem',
        explanation:
          "Don't worry! Something in your HTML is incorrect — maybe a tag isn't closed or is misspelled.",
        tip: 'Check: every opening tag <div> needs a closing </div>. Tags are case-insensitive but must be spelled correctly: <p>, not <para>.',
      },
    }
  }

  // ── UnhandledPromiseRejection ─────────────────────────────────────────────
  if (type === 'UnhandledPromiseRejection') {
    return {
      ru: {
        title: 'Промис завершился с ошибкой',
        explanation:
          'Не переживай! Асинхронная операция (Promise) завершилась с ошибкой, и никто её не обработал.',
        tip: 'Если ты используешь fetch() или async/await, добавь try/catch или .catch() для обработки ошибок.',
      },
      en: {
        title: 'Unhandled promise rejection',
        explanation:
          "Don't worry! An asynchronous operation (Promise) failed and nobody handled the error.",
        tip: 'If you use fetch() or async/await, add try/catch or .catch() to handle errors.',
      },
    }
  }

  // ── Default ───────────────────────────────────────────────────────────────
  return {
    ru: {
      title: `Что-то пошло не так${lineHint}`,
      explanation:
        'Не переживай — ошибки это нормальная часть программирования! Даже самые опытные разработчики встречают их каждый день.',
      tip: 'Посмотри на сообщение ошибки ниже — там есть подсказка. Попробуй запустить код по частям, чтобы найти проблемное место.',
    },
    en: {
      title: `Something went wrong${lineHint}`,
      explanation:
        "Don't worry — errors are a normal part of programming! Even the most experienced developers run into them every day.",
      tip: "Look at the error message below — there's a clue there. Try running your code in parts to narrow down the problem.",
    },
  }
}
