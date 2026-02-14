'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../../../../lib/firebase'

export default function OtpPage() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const verifyOtp = async () => {
        try {
            setLoading(true)

            if (!window.confirmationResult) {
                alert('Session OTP tidak ditemukan')
                return
            }

            const result = await window.confirmationResult.confirm(otp)
            const user = result.user

            // Ambil data dari sessionStorage
            const storedData = JSON.parse(
                sessionStorage.getItem('registerData'),
            )

            if (!storedData) {
                alert('Data registrasi tidak ditemukan')
                return
            }

            await setDoc(doc(db, 'users', user.uid), {
                fullName: storedData.firstName,
                nik: storedData.lastName,
                email: storedData.email || '',
                phone: user.phoneNumber,
                createdAt: new Date(),
            })

            sessionStorage.removeItem('registerData')

            router.push('/dashboard')
        } catch (error) {
            console.error(error)
            alert('OTP salah atau gagal menyimpan data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5'>
                <h1 className='text-lg font-bold text-center'>
                    Verifikasi OTP
                </h1>

                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder='Masukkan 6 digit OTP'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500'
                />

                <button
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    className='w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50'
                >
                    {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
            </div>
        </div>
    )
}
