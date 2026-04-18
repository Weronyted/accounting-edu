import { MessageCircle } from 'lucide-react'

export function SupportButton() {
  return (
    <a
      href="https://t.me/Weronyted"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8bbf] text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      title="Contact support on Telegram"
    >
      <MessageCircle size={17} />
      <span>Support</span>
    </a>
  )
}
