import { redirect } from "next/navigation"

export default function RoadmapPage({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/roadmap/${params.id}/weeks`)
}
