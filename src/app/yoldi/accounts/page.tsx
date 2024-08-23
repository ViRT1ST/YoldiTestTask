import ContentWrapper from '@/components/body-children/content-wrapper';

import AccountList from '@/components/yoldi-main-page/accounts-list';

export const metadata = {
  title: 'Yoldi Page',
};

export default function AccountPage() {
  return (
    <ContentWrapper>
      <AccountList />
    </ContentWrapper>
  );
}
