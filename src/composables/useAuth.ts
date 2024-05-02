export default () => {
  const useAccessToken = () => useState<string | null>('access_token')
  const useAuthLoading = () => useState<boolean>('auth_loading', () => true)

  const setToken = (newToken: string | null) => {
    const authToken = useAccessToken()
    authToken.value = newToken
  }

  const setIsAuthLoading = (value: boolean) => {
    const authLoading = useAuthLoading()
    authLoading.value = value
  }

  const login = async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => {
    setIsAuthLoading(true)
    const { data, error } = await useApiCall<{ accessToken: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: {
          username,
          password
        }
      }
    )
    if (data && data.accessToken) {
      setToken(data.accessToken)
      setIsAuthLoading(false)
    } else {
      setIsAuthLoading(false)
      throw error
    }
  }

  const logout = async () => {
    await useApiCall('/api/auth/logout')
    setToken(null)
    await navigateTo('/admin/login')
  }

  const refreshToken = async () => {
    try {
      const { accessToken } = await $fetch('/api/auth/refresh')
      setToken(accessToken)
    } catch (error) {
      const path = useRouter().currentRoute.value.path
      if (path.includes('admin') && !path.includes('login')) {
        await navigateTo({
          path: '/admin/login',
          query: { redirected: 'true' }
        })
      }
      throw error
    }
  }

  const initAuth = async () => {
    setIsAuthLoading(true)
    try {
      await refreshToken()
    } finally {
      setIsAuthLoading(false)
    }
  }

  return {
    login,
    useAccessToken,
    refreshToken,
    initAuth,
    useAuthLoading,
    logout
  }
}
