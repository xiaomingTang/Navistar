import { HomeDesc } from './HomeDesc'

import DefaultLayout from '@/layout/DefaultLayout'
import { DefaultBodyContainer } from '@/layout/DefaultBodyContainer'
import { seo } from '@/utils/seo'

export const revalidate = 60

export const metadata = seo.defaults({
  title: 'homepage',
})

export default async function Home() {
  return (
    <DefaultLayout>
      <DefaultBodyContainer>
        <HomeDesc />
      </DefaultBodyContainer>
    </DefaultLayout>
  )
}
