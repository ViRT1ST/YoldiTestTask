import ContentWrapper from '@/components/body-children/content-wrapper';
import AuthForm from '@/components/yoldi-auth/auth-form';

export const metadata = {
  title: 'Yoldi Auth Page',
};

export default function AuthPage() {
  return (
    <ContentWrapper className="xs:bg-[#F3F3F3]">
      <AuthForm />
    </ContentWrapper>
  );
}
