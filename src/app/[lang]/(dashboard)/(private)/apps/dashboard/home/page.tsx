import { getServerMode } from '@/@core/utils/serverHelpers'
import Home from '@/views/apps/dashboard/home/home'
import AIChatbotWidget from '@/views/pages/ai-chatbot-widget'

const HomePage = async () => {
  const mode = await getServerMode()
  return (
    <>
      <Home mode={mode} />
    </>
  )
}

export default HomePage
