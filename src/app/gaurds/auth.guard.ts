import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  role_id?: number
  exp?: number
}

// Basic check for role and expiration
export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const token = localStorage.getItem('token')
  console.log('Token:', token)

  if (!token) {
    router.navigate(['/auth'])
    return false
  }

  try {
    const decoded: JwtPayload = jwtDecode(token)

    // Check if the token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      router.navigate(['/auth'])
      return false
    }

    return !!decoded.role_id
  } catch {
    console.log('Invalid token')
    router.navigate(['/auth'])
    return false
  }
}
