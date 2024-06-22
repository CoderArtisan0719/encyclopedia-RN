import {useRecoilValueLoadable} from 'recoil';
import {fetchBookmarksSelector} from '../recoil/selectors/bookmarkSelector';

const useFetchBookmarks = () => {
  const bookmarksLoadable = useRecoilValueLoadable(fetchBookmarksSelector);
  const bookmarks =
    bookmarksLoadable.state === 'hasValue' ? bookmarksLoadable.contents : [];
  const loading = bookmarksLoadable.state === 'loading';

  return {bookmarks, loading};
};

export default useFetchBookmarks;
