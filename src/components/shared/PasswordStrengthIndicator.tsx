'use client'

import { useMemo } from 'react'
import { Box, Typography, LinearProgress, Chip } from '@mui/material'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
interface PasswordRule {
  id: string
  label: string
  validator: (password: string) => boolean
  description?: string
}

interface PasswordStrengthIndicatorProps {
  password: string
  showStrength?: boolean
}

const passwordRules: PasswordRule[] = [
  {
    id: 'minLength',
    label: 'الحد الأدنى 8 أحرف',
    description: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل',
    validator: pwd => pwd.length >= 8
  },
  {
    id: 'uppercase',
    label: 'حرف كبير واحد على الأقل (A-Z)',
    description: 'يجب أن تحتوي على حرف كبير',
    validator: pwd => /[A-Z]/.test(pwd)
  },
  {
    id: 'lowercase',
    label: 'حرف صغير واحد على الأقل (a-z)',
    description: 'يجب أن تحتوي على حرف صغير',
    validator: pwd => /[a-z]/.test(pwd)
  },
  {
    id: 'number',
    label: 'رقم واحد على الأقل (0-9)',
    description: 'يجب أن تحتوي على رقم',
    validator: pwd => /[0-9]/.test(pwd)
  },
  {
    id: 'symbol',
    label: 'رمز خاص واحد على الأقل (!@#$%)',
    description: 'يجب أن تحتوي على رمز خاص',
    validator: pwd => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  }
]

export const PasswordStrengthIndicator = ({ password, showStrength = true }: PasswordStrengthIndicatorProps) => {
  const validation = useMemo(() => {
    const results = passwordRules.map(rule => ({
      ...rule,
      passed: rule.validator(password)
    }))

    const passedCount = results.filter(r => r.passed).length
    const totalCount = results.length
    const strength = (passedCount / totalCount) * 100

    let strengthLevel: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    let strengthColor: 'error' | 'warning' | 'info' | 'success' = 'error'
    let strengthText = 'ضعيفة جداً'

    if (passedCount >= 5) {
      strengthLevel = 'strong'
      strengthColor = 'success'
      strengthText = 'قوية جداً'
    } else if (passedCount >= 4) {
      strengthLevel = 'good'
      strengthColor = 'info'
      strengthText = 'جيدة'
    } else if (passedCount >= 2) {
      strengthLevel = 'fair'
      strengthColor = 'warning'
      strengthText = 'متوسطة'
    }

    return {
      results,
      passedCount,
      totalCount,
      strength,
      strengthLevel,
      strengthColor,
      strengthText,
      isValid: passedCount === totalCount
    }
  }, [password])

  if (!password) {
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          متطلبات كلمة المرور:
        </Typography>
        {passwordRules.map(rule => (
          <Box
            key={rule.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              opacity: 0.6
            }}
          >
            <Cancel sx={{ fontSize: 15, color: 'text.disabled' }} />
            <Typography variant='body2' color='text.secondary'>
              {rule.label}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Strength Progress Bar */}
      {showStrength && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant='caption' color='text.secondary'>
              قوة كلمة المرور
            </Typography>
            <Chip
              label={validation.strengthText}
              size='small'
              color={validation.strengthColor}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          <LinearProgress
            variant='determinate'
            value={validation.strength}
            color={validation.strengthColor}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'action.hover'
            }}
          />
        </Box>
      )}

      {/* Requirements List */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'action.hover',
          borderRadius: 1,
          border: '1px solid',
          borderColor: validation.isValid ? 'success.main' : 'divider'
        }}
      >
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5, fontWeight: 500 }}>
          متطلبات كلمة المرور:
        </Typography>
        {validation.results.map(result => (
          <Box
            key={result.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              transition: 'all 0.3s ease',
              transform: result.passed ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {result.passed ? (
              <CheckCircle
                sx={{
                  fontSize: 18,
                  color: 'success.main',
                  animation: 'pulse 0.5s ease-in-out'
                }}
              />
            ) : (
              <Cancel
                sx={{
                  fontSize: 18,
                  color: 'error.main',
                  opacity: 0.7
                }}
              />
            )}
            <Typography
              variant='body2'
              sx={{
                color: result.passed ? 'success.main' : 'text.secondary',
                fontWeight: result.passed ? 500 : 400,
                textDecoration: result.passed ? 'line-through' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {result.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Additional Info */}
      {validation.isValid && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant='caption' color='success.main' sx={{ fontWeight: 500 }}>
            كلمة المرور تستوفي جميع المتطلبات ✓
          </Typography>
        </Box>
      )}
    </Box>
  )
}
