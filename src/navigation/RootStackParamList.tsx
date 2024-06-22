export type RootStackParamList = {
  Tabs: undefined;
  BookDetail: {book: Book; title: string};
};

export type Book = {
  id: number;
  title: string;
  authors: {name: string}[];
  formats: {
    'image/jpeg': string;
    'text/html': string;
  };
};
