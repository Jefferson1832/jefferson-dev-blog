import Image from 'next/image'

export function Header() {
    return (
        <header className='w-full h20 sm:h-32 flex items-center'>
            <Image 
                src={"/logo3.png"}
                alt='Logomarca'
                width={200}
                height={45}
                className='w-44 sm:w-[300px] md:pt-9'
            />
        </header>
    )
}