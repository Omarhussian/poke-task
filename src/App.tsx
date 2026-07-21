import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/Layout'
import PaginationView from '@/views/PaginationView'
import LoadMoreView from '@/views/LoadMoreView'
import DetailPage from '@/views/DetailPage'
import { NotFound } from '@/views/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PaginationView />} />
        <Route path="load-more" element={<LoadMoreView />} />
        <Route path="pokemon/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
