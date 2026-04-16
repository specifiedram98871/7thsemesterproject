import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {

    const [toggleSidebar, setToggleSidebar] = useState(false);

    return (
        <>
            <main className="min-h-screen mt-14 sm:min-w-full">
                <Sidebar
                    activeTab={activeTab}
                    isOpen={toggleSidebar}
                    setToggleSidebar={setToggleSidebar}
                />

                {toggleSidebar && (
                    <button
                        type="button"
                        aria-label="Close sidebar backdrop"
                        onClick={() => setToggleSidebar(false)}
                        className="fixed bottom-0 left-0 right-0 top-14 z-40 bg-black/50 md:hidden"
                    />
                )}

                <div className="min-h-screen w-full md:pl-72">
                    <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                        {!toggleSidebar && (
                            <button
                                type="button"
                                onClick={() => setToggleSidebar(true)}
                                className="md:hidden fixed left-3 top-[4.5rem] z-30 bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center"
                                aria-label="Open sidebar"
                            >
                                <MenuIcon />
                            </button>
                        )}
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
