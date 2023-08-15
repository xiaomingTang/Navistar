import { Backstage } from '../components/Backstage'

import DefaultLayout from '@/layout/DefaultLayout'
import { DefaultBodyContainer } from '@/layout/DefaultBodyContainer'
import { seo } from '@/utils/seo'

export const revalidate = 60

export const metadata = seo.defaults({
  title: 'backstage',
})

export default async function Home() {
  return (
    <DefaultLayout>
      <DefaultBodyContainer>
        <Backstage />
      </DefaultBodyContainer>
    </DefaultLayout>
  )
}
