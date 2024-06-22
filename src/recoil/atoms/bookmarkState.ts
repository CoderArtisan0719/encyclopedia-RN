import {atom} from 'recoil';
import {fetchBookmarksSelector} from '../selectors/bookmarkSelector';

export const bookmarksState = atom({
  key: 'bookmarksState',
  default: [],
});
