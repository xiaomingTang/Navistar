import { RedirectType } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

export const revalidate = 60

export default async function Home() {
  redirect('/user-test', RedirectType.replace)
}
