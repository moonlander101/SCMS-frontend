import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import {jwtDecode } from 'jwt-decode'

interface JwtPayload {
  role?: string
  exp?: number
}

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const router = inject(Router)
    const token = localStorage.getItem('token')

    if (!token) return router.createUrlTree(['/auth'])

    try {
      const decoded: JwtPayload = jwtDecode(token)

      // Check if the token has expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          router.navigate(['/auth'])
          return false
      }

      return decoded.role === expectedRole ? true : router.createUrlTree(['/auth'])
    } catch {
      return router.createUrlTree(['/auth'])
    }
  }
}
