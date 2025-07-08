import Footer_User from '@/modules/systems/home-user/footer-user/footer';
import Header_User from '@/modules/systems/home-user/header-user/header';
import '@/assets/scss/_global.scss';
const Home_User = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
    <Header_User />
      {children}
    <Footer_User />
    </>
  );
};
export default Home_User;
