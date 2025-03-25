import { Tab } from '@headlessui/react';
import ArticleList from './components/ArticleList';
import CreateArticle from './components/CreateArticle';
import ArticleSearch from './components/ArticleSearch';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Article Management System
            </h1>
            <p className="text-gray-600 text-lg">Manage your articles with ease</p>
          </div>
          
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white/20 p-1.5 mb-8 shadow-lg backdrop-blur-sm">
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-all duration-200
                ${selected 
                  ? 'bg-white text-blue-600 shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'}`
              }>
                Articles
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-all duration-200
                ${selected 
                  ? 'bg-white text-blue-600 shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'}`
              }>
                Create Article
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-all duration-200
                ${selected 
                  ? 'bg-white text-blue-600 shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900'}`
              }>
                Search
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <ArticleList />
              </Tab.Panel>
              <Tab.Panel>
                <CreateArticle />
              </Tab.Panel>
              <Tab.Panel>
                <ArticleSearch />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </>
  );
}

export default App;
