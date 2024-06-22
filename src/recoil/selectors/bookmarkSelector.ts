import {selector} from 'recoil';
import axiosInstance from '../..//config/axios';
import {bookmarksState} from '../..//recoil/atoms/bookmarkState';

export const fetchBookmarksSelector = selector({
  key: 'fetchBookmarksSelector',
  get: async ({get}) => {
    const bookmarks = get(bookmarksState);
    if (bookmarks.length === 0) {
      try {
        const response = await axiosInstance.get('/bookmark');
        return response.data.payload;
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
        return [];
      }
    }
    return bookmarks;
  },
});
