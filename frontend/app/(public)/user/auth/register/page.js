'use client'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
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

                <label>Nomor Telepon</label>
                <input
                    {...register('Handphone')}
                    placeholder='08xxxxxxxxxx'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <label>Email (Opsional)</label>
                <input
                    {...register('email')}
                    placeholder='Email@example.com'
                    type='email'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200'
                >
                    Lanjutkan
                </button>
            </form>
        </div>
    )
}
