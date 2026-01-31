import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
        <p className="text-neutral-400 mt-1">Vos conversations</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="py-12">
          <div className="text-neutral-500 text-sm text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
            <p>La messagerie sera bientôt disponible.</p>
            <p className="text-neutral-600 mt-1">Restez connecté !</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
