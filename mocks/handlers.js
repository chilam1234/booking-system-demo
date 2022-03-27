import { rest } from 'msw'

export const handlers = [
  rest.post('http://localhost/api/createBooking', (req, res, ctx) => {
    return res(
      ctx.json({
        ts: 1648354929210000,
        data: {
          start: '2022-03-26T17:00:00.555Z',
          end: '2022-03-26T18:00:00.635Z',
          room: 'c1',
          remarks: 'asdasdasd',
          userId: 'google-oauth2|112017502625468671953',
        },
        id: '327256303278752329',
      }),
    )
  }),
  rest.put('http://localhost/api/updateBooking', (req, res, ctx) => {
    return res(
      ctx.json({
        ref: {
          '@ref': {
            id: '327262117749064268',
            collection: {
              '@ref': {
                id: 'bookings',
                collection: { '@ref': { id: 'collections' } },
              },
            },
          },
        },
        ts: 1648363481590000,
        data: {
          start: '2022-03-26T23:00:00.409Z',
          end: '2022-03-27T00:00:00.263Z',
          room: 'c1',
          remarks: 'sadasd',
          userId: 'google-oauth2|112017502625468671953',
        },
      }),
    )
  }),
  rest.delete('http://localhost/api/deleteBooking', (req, res, ctx) => {
    return res(
      ctx.json({
        ref: {
          '@ref': {
            id: '327256475387822667',
            collection: {
              '@ref': {
                id: 'bookings',
                collection: { '@ref': { id: 'collections' } },
              },
            },
          },
        },
        ts: 1648354945460000,
        data: {
          start: '2022-03-26T17:01:00.983Z',
          end: '2022-03-26T18:00:00.095Z',
          room: 'c1',
          remarks: 'asdasd',
          userId: 'google-oauth2|112017502625468671953',
        },
      }),
    )
  }),
]
