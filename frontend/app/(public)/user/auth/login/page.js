'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../../../../lib/firebase'
import { useState } from 'react'

export default function LoginPage() {
    const { register, handleSubmit } = useForm()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            const q = query(
                collection(db, 'users'),
                where('fullName', '==', data.firstName),
                where('nik', '==', data.lastName),
            )

            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                alert('Login berhasil')
                router.push('/dashboard')
            } else {
                alert('Nama atau NIK tidak ditemukan')
            }
        } catch (error) {
            console.error(error)
            alert('Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex-col min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5'
            >
                <div>
                    <h1 className='font-bold'>Login Finbridge.id</h1>
                    <p className='text-gray-500'>
                        Masukkan Nama dan NIK untuk melanjutkan
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

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 disabled:opacity-50'
                >
                    {loading ? 'Memproses...' : 'Login'}
                </button>

                <p className='text-sm text-center'>
                    Belum punya akun?{' '}
                    <Link className='text-blue-700' href='/user/auth/register'>
                        Register Disini
                    </Link>
                </p>
            </form>
        </div>
    )
}
