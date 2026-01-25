import React from 'react';

export default function NavbarHome() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-sm dark:bg-gray-800">
            <div className="text-xl font-bold text-orange-600">PicknDrop</div>
            <div className="flex gap-4">
                <button className="text-sm font-medium text-gray-600 dark:text-gray-300">Login</button>
            </div>
        </nav>
    );
}
