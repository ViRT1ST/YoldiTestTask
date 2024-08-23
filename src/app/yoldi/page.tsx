import ContentWrapper from '@/components/body-children/content-wrapper';

import AccountList from '@/components/yoldi-main-page/accounts-list';

export const metadata = {
  title: 'Yoldi Page',
};

export default function MainPage() {
  return (
    <ContentWrapper>
      <AccountList />
    </ContentWrapper>
  );
}



// export default function MainPage() {
//   return (
//     <p className="mt-10 mx-auto">
//       Главная страница (нет контента)
//     </p>
//   );
// }