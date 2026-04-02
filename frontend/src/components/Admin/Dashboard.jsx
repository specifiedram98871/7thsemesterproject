import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {

    const [toggleSidebar, setToggleSidebar] = useState(false);

    return (
        <>
            <main className="min-h-screen mt-14 sm:min-w-full">

                <div className="hidden md:block">
                    <Sidebar activeTab={activeTab} />
                </div>

                {toggleSidebar && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <button
                            type="button"
                            aria-label="Close sidebar"
                            onClick={() => setToggleSidebar(false)}
                            className="absolute inset-0 bg-black/50"
                        />
                        <div className="absolute inset-y-0 left-0 z-50">
                            <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar} />
                        </div>
                    </div>
                )}

                <div className="min-h-screen w-full md:pl-72">
                    <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setToggleSidebar(true)}
                            className="md:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center"
                            aria-label="Open sidebar"
                        >
                            <MenuIcon />
                        </button>
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
