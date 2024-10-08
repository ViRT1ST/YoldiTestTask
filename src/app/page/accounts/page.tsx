import ContentWrapper from '@/components/[body-children]/content-wrapper';
import AccountList from '@/components/accounts/accounts-list';

export const metadata = {
  title: 'Yoldi Accounts List',
};

export default function AccountPage() {
  return (
    <ContentWrapper>
      <AccountList />
    </ContentWrapper>
  );
}
