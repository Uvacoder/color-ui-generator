import { Tab } from '@fluid-design/fluid-ui';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

import { BaseColors, useBaseColors } from '@/lib/AppContext';
import { throwDice } from '@/lib/dice';
import { generateBaseColors } from '@/lib/generateBaseColors';

import { AboutComponent } from '@/components/AboutComponent';
import { ColorAsTextComponent } from '@/components/ColorAsTextComponent';
import ColorComponent from '@/components/ColorComponent';
import ColorPicker from '@/components/ColorPicker';
import UnderlineLink from '@/components/links/UnderlineLink';
import { PreviewComponent } from '@/components/PreviewComponent';
import Seo from '@/components/Seo';
import { TailwindConfigComponent } from '@/components/TailwindConfigComponent';
import { Toolbar } from '@/components/Toolbar';

export default function HomePage({
  initColors,
  dice: initDice,
}: {
  initColors: BaseColors;
  dice: number;
}) {
  const [baseColors, setBaseColors] = useBaseColors({
    initialColors: initColors,
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [colorName, setColorName] = useState('Awesome Color');
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(null);
  const componentRef = useRef(null);
  const handleChangeColor = ({ type }) => {
    setType(type);
    setIsPickerOpen(true);
  };
  return (
    <>
      <Seo
        templateTitle='ColorGenerator4u'
        image='https://github.com/assets/13263720/00f36291-a4ae-4e74-bfcb-56c55e49e2c6'
      />

      <main>
        <Toolbar initColors={initColors} initDice={initDice} />
        <section className='min-h-main mx-auto flex max-w-[93.75rem] items-center justify-center px-4 pb-8'>
          <div className='flex-grow'>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 20 }}
              className='mb-12 flex flex-1 flex-col items-center justify-center rounded-3xl text-center shadow-2xl shadow-stone-300/30 dark:shadow-black/70 lg:mb-16'
            >
              <AnimatePresence>
                {isPickerOpen && (
                  <ColorPicker
                    type={type}
                    colors={baseColors || initColors}
                    onChange={setBaseColors}
                    onDismiss={() => setIsPickerOpen(false)}
                  />
                )}
                <ColorComponent
                  ref={componentRef}
                  key='color-component'
                  colors={baseColors || initColors}
                  onChangeColor={handleChangeColor}
                  inputs={{
                    ...{ isEditing, colorName, setColorName, setIsEditing },
                  }}
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
        <section className='mx-auto w-full max-w-[93.75rem]'>
          <div className='flex w-full max-w-full flex-col items-center justify-center px-4'>
            <Tab>
              <Tab.List className='overscroll-x-auto sm:self-start'>
                <Tab.ListItem>Preview</Tab.ListItem>
                <Tab.ListItem>Tailwind</Tab.ListItem>
                <Tab.ListItem>CSS</Tab.ListItem>
                <Tab.ListItem>About</Tab.ListItem>
              </Tab.List>
              <Tab.Panels className='my-8'>
                <Tab.Panel tabPanelClassName=''>
                  <PreviewComponent />
                </Tab.Panel>
                <Tab.Panel tabPanelClassName=''>
                  <TailwindConfigComponent />
                </Tab.Panel>
                <Tab.Panel tabPanelClassName=''>
                  <ColorAsTextComponent colorName={colorName} />
                </Tab.Panel>
                <Tab.Panel tabPanelClassName=''>
                  <AboutComponent />
                </Tab.Panel>
              </Tab.Panels>
            </Tab>
            <button
              disabled={isEditing}
              className='mt-8 rounded-full border border-stone-800 bg-transparent py-2 px-4 font-semibold text-stone-800 shadow-lg transition hover:bg-stone-800 hover:text-white hover:shadow-none focus:outline-none  disabled:cursor-not-allowed disabled:opacity-20 dark:bg-transparent dark:text-stone-100 dark:hover:bg-stone-50 dark:hover:text-black'
              onClick={async () => {
                const { exportComponentAsPNG } = await import(
                  'react-component-export-image'
                );
                exportComponentAsPNG(componentRef, {
                  // replace space with dash, and lowercase, and remove special characters
                  fileName: `color-picker-${colorName
                    .replace(/\s/g, '-')
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')}`,
                  html2CanvasOptions: {
                    backgroundColor: 'transparent',
                    scale: 2,
                  },
                });
              }}
            >
              Export As PNG
            </button>
          </div>
        </section>
        <footer className='pt-24 pb-8 text-center text-gray-700'>
          © {new Date().getFullYear()} By{' '}
          <UnderlineLink href='https://abclinks.vercel.app/'>
            uvacoder
          </UnderlineLink>
        </footer>
      </main>
    </>
  );
}

// a next.js static function
export async function getServerSideProps() {
  // generate a boolean based on if number is less than or equal to 0.5
  const initColors = generateBaseColors();
  const dice = throwDice();
  return {
    props: {
      initColors,
      dice,
    },
  };
}
