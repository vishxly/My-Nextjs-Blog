import { Gauge, LayoutList, Layers2, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        {
            name: 'Dashboard',
            link: '/admin',
            icon: <Gauge size={20} />,
        },
        {
            name: 'Posts',
            link: '/admin/posts',
            icon: <LayoutList size={20} />,
        },
        {
            name: 'Categories',
            link: '/admin/categories',
            icon: <Layers2 size={20} />,
        },
        {
            name: 'Authors',
            link: '/admin/authors',
            icon: <User size={20} />,
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                className="fixed z-20 p-2 text-white bg-blue-500 rounded-md md:hidden top-4 left-4"
                onClick={toggleSidebar}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <section 
                className={`
                    fixed md:static top-0 left-0 z-10
                    w-64 md:w-[200px] min-h-screen 
                    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                    transition-all duration-300 ease-in-out
                    border-r p-6 
                    bg-white dark:bg-black dark:border-gray-700
                    flex flex-col
                `}
            >
                <ul className='flex flex-col w-full gap-6 mt-16 md:mt-0'>
                    {links.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <li 
                                className='flex items-center gap-3 px-5 py-2 font-bold transition-colors duration-200 rounded-full bg-blue-50 dark:bg-black dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800'
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                <span className='text-sm'>{item.name}</span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </section>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-0 bg-black bg-opacity-50 md:hidden" 
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}
