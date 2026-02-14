'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <div className='flex-col min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5'
            >
                <div>
                    <h1 className='font-bold'>Daftar Akun Finbridge.id</h1>
                    <p className='text-gray-500'>
                        Lengkapi informasi dasar Anda untuk memulai
                    </p>
                </div>

                <label>Nama Lengkap</label>
                <input
                    {...register('firstName')}
                    placeholder='Sesuai KTP'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <label>NIK (Nomor Induk Kependudukan)</label>
                <input
                    {...register('lastName')}
                    placeholder='16 Digit NIK'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <button
                    type='submit'
                    className='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200'
                >
                    Lanjutkan
                </button>
                <p className='text-sm text-center'>
                    Dengan mendaftar, Anda menyetujui{' '}
                    <span className='text-blue-500'>Syarat & Ketentuan</span>{' '}
                    dan <span className='text-blue-500'>Kebijakan Privasi</span>
                </p>
            </form>

            <p className='mt-4'>
                Belum punya akun?{' '}
                <Link className='text-blue-700' href='/user/auth/register'>
                    Register Disini
                </Link>
            </p>
        </div>
    )
}
