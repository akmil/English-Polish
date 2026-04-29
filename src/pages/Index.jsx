import { useGitHub } from '@/context/GitHubContext';
import LoginScreen from '@/components/drive/LoginScreen';
import Drive from './Drive';

export default function Index() {
  const { isAuthenticated } = useGitHub();
  return isAuthenticated ? <Drive /> : <LoginScreen />;
}