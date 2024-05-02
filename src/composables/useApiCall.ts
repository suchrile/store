import { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { H3Error } from 'h3'

export const useApiCall = async <
  T = unknown,
  R extends NitroFetchRequest = NitroFetchRequest
>(
  request: R,
  opts: NitroFetchOptions<R> = {},
  toastOnError = true
) => {
  const headers = new Headers(opts.headers)
  const response: { data: T | null; error: H3Error | null } = {
    data: null,
    error: null
  }
  const { useAccessToken, refreshToken } = useAuth()
  let isRefreshAttempted = false

  const makeRequest = async () => {
    const accessToken = useAccessToken().value
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    try {
      response.data = (await $fetch<T, R>(request, { ...opts, headers })) as T
    } catch (caught) {
      response.error = caught as H3Error
      if (response.error.statusCode === 401 && !isRefreshAttempted) {
        isRefreshAttempted = true
        try {
          await refreshToken()
          await makeRequest()
        } catch (error) {
          response.error = error as H3Error
          throwError(response.error)
        }
      } else {
        throwError(response.error)
      }
    }
  }

  const throwError = (error: H3Error) => {
    toastOnError &&
      useNuxtApp().vueApp.config.globalProperties.$toast.add({
        severity: 'error',
        summary: `Ошибка сервера (${error.statusCode})`,
        detail: error.data?.message || '',
        life: 7000
      })
  }

  await makeRequest()

  return response
}
