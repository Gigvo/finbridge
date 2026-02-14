'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../../../../../lib/firebase'

export default function RegisterPage() {
    const { register, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            let phone = data.handphone.trim()

            // Normalisasi nomor Indonesia
            if (phone.startsWith('0')) {
                phone = '+62' + phone.slice(1)
            } else if (phone.startsWith('62')) {
                phone = '+' + phone
            } else if (!phone.startsWith('+62')) {
                alert('Format nomor tidak valid')
                return
            }

            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    'recaptcha-container',
                    { size: 'invisible' },
                )
            }

            const result = await signInWithPhoneNumber(
                auth,
                phone,
                window.recaptchaVerifier,
            )

            // Simpan confirmationResult sementara di window
            window.confirmationResult = result

            alert('OTP berhasil dikirim')
            router.push('/user/auth/otp')
        } catch (error) {
            console.error(error)
            alert('Gagal mengirim OTP')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex flex-col pt-5 items-center justify-center bg-gray-100 px-4'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5'
            >
                <div>
                    <h1 className='font-bold text-lg'>
                        Daftar Akun Finbridge.id
                    </h1>
                    <p className='text-gray-500 text-sm'>
                        Lengkapi informasi dasar Anda untuk memulai
                    </p>
                </div>

                <label>Nama Lengkap</label>
                <input
                    {...register('firstName')}
                    placeholder='Sesuai KTP'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <label>NIK</label>
                <input
                    {...register('lastName')}
                    placeholder='16 Digit NIK'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <label>Nomor Telepon</label>
                <input
                    {...register('handphone')}
                    type='tel'
                    placeholder='08xxxxxxxxxx'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <label>Email (Opsional)</label>
                <input
                    {...register('email')}
                    type='email'
                    placeholder='Email@example.com'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50'
                >
                    {loading ? 'Memproses...' : 'Kirim OTP'}
                </button>

                <p className='text-sm text-center'>
                    Dengan mendaftar, Anda menyetujui{' '}
                    <span className='text-blue-500'>Syarat & Ketentuan</span>{' '}
                    dan <span className='text-blue-500'>Kebijakan Privasi</span>
                </p>
            </form>

            <div id='recaptcha-container'></div>

            <p className='mt-4'>
                Sudah punya akun?{' '}
                <Link className='text-blue-700' href='/user/auth/login'>
                    Login Disini
                </Link>
            </p>
        </div>
    )
}
