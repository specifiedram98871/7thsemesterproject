import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
      setKeyword("");
    }, [pathname]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) {
          enqueueSnackbar('Enter something to search', { variant: 'warning' });
          return;
        }

        navigate(`/products/${encodeURIComponent(trimmedKeyword)}`);
    }

    return (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-md"
        >
            <SearchIcon className="text-orange-200" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/30"
              type="text"
              placeholder="Search pizzas, sides, drinks and more"
            />
            <button type="submit" className="rounded-full bg-[#c2410c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#a63d13]">
              Search
            </button>
        </form>
    );
};

export default Searchbar;
