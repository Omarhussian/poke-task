import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('marks the current page and collapses distant pages into ellipses', () => {
    render(
      <Pagination currentPage={6} totalPages={42} onPageChange={() => {}} />,
    )

    expect(screen.getByRole('button', { name: '6' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    // 1 … 5 6 7 … 42
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '42' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument()
  })

  it('notifies on page and prev/next clicks, clamped to valid pages', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)

    await user.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)
  })

  it('disables the previous control on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    )
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
  })
})
