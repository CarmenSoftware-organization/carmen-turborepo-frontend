'use server'
import { formSchema, FormValues } from "../type/type"

export async function submitForm(formData: FormValues) {
    const result = formSchema.safeParse(formData)
    const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3500'

    if (!result.success) {
        return { error: result.error.errors[0].message }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to submit form')
        }

        const data = await response.json()
        return { success: true, data }

    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to submit form' }
    }
}