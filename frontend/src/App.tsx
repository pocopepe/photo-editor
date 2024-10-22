import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import MainEditor from './components/MainEditor';
import FilesBar from './components/FilesBar';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[5%] bg-gray-800">
          <SideBar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-gray-100">
            <MainEditor />
          </div>
          <div className="h-1/5 bg-gray-200 overflow-y-scroll">
            <FilesBar />
          </div>
        </div>
      </div>
    </div>
    </RecoilRoot>
  );
}

export default App;
