import '@/assets/scss/_global.scss';
import SmartChatComponent from '@/components/UI_shared/SmartChat';
import Footer_User from '@/modules/systems/manage-web/home-user/footer-user/footer';
import Header_User from '@/modules/systems/manage-web/home-user/header-user/header';
import { Layout } from 'antd';
const Home_User = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Header_User />
      {children}
    <Footer_User />
    <SmartChatComponent/>
    </Layout>

  );
};

export default Home_User;
