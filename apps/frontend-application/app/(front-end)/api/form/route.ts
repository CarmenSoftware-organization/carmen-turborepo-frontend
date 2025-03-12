import { NextResponse } from 'next/server'
import { formSchema } from '../../(main)/procurement/type/type'

export async function GET() {
    return Response.json({
        message: `Hello form`,
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = formSchema.safeParse(body)

        console.log('API Route result', result)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                message: 'Form submitted successfully',
                receivedData: result.data
            }
        })

        // const externalResponse = await fetch('https://your-external-api.com', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`
        //     },
        //     body: JSON.stringify(result.data)
        // })

        // if (!externalResponse.ok) {
        //     throw new Error('External API request failed')
        // }

        // const externalData = await externalResponse.json()
        // return NextResponse.json({ success: true, data: externalData })

    } catch (error) {
        console.error('API Route Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}