import { useState } from 'react'
import CardGallery from './CardGallery.jsx'
import { DISPLAY, MONO } from './phase2/ResultRow.jsx'
import { EditorialS1, EditorialS2 } from './phase2/VersionEditorial.jsx'
import { LedgerS1, LedgerS2 } from './phase2/VersionLedger.jsx'
import { SplitS1, SplitS2 } from './phase2/VersionSplit.jsx'

const VERSIONS = [
  { id: 'ledger', label: 'V1 Ledger', S1: LedgerS1, S2: LedgerS2 },
  { id: 'editorial', label: 'V2 Editorial', S1: EditorialS1, S2: EditorialS2 },
  { id: 'split', label: 'V3 Split', S1: SplitS1, S2: SplitS2 },
]

const S2_STATES = ['populated', 'loading', 'empty']
const S1_STATES = ['empty', 'filled']

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[2px] border-[0.889px] border-solid px-[12px] py-[6px] ${DISPLAY} text-[11px] font-bold uppercase leading-[16.5px] tracking-[1.1px] transition-colors ${
        active
          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
          : 'border-[#e4e4e4] bg-transparent text-[#9a9a9a] hover:border-[#c2c2c2] hover:text-[#0a0a0a]'
      }`}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [versionId, setVersionId] = useState('ledger')
  const [screen, setScreen] = useState('S1')
  const [s1State, setS1State] = useState('filled')
  const [s2State, setS2State] = useState('populated')

  const version = VERSIONS.find((v) => v.id === versionId)
  const showingCard = versionId === 'card'

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 border-b-[0.889px] border-solid border-[#e4e4e4] bg-white">
        <div className="mx-auto flex w-[1104px] flex-wrap items-center gap-[20px] py-[12px]">
          <span className={`${MONO} text-[13px] leading-[19.5px] text-[#6b6b6b]`}>
            NameGenius · Phase 2
          </span>

          <div className="flex items-center gap-[8px]">
            {VERSIONS.map((v) => (
              <Tab key={v.id} active={versionId === v.id} onClick={() => setVersionId(v.id)}>
                {v.label}
              </Tab>
            ))}
            <Tab active={showingCard} onClick={() => setVersionId('card')}>
              S3 card
            </Tab>
          </div>

          {!showingCard && (
            <>
              <div className="flex items-center gap-[8px]">
                {['S1', 'S2'].map((s) => (
                  <Tab key={s} active={screen === s} onClick={() => setScreen(s)}>
                    {s}
                  </Tab>
                ))}
              </div>

              <div className="flex items-center gap-[8px]">
                {(screen === 'S1' ? S1_STATES : S2_STATES).map((s) => (
                  <Tab
                    key={s}
                    active={(screen === 'S1' ? s1State : s2State) === s}
                    onClick={() => (screen === 'S1' ? setS1State(s) : setS2State(s))}
                  >
                    {s}
                  </Tab>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showingCard ? (
        <CardGallery />
      ) : (
        <div className="min-h-screen bg-[#fafafa] py-[48px]">
          <div className="mx-auto w-[1200px] border-[0.889px] border-solid border-[#e4e4e4] bg-white px-[48px]">
            {screen === 'S1' ? (
              // Remount on state change so the TLD picker re-seeds from the fixture.
              <version.S1 key={s1State} filled={s1State === 'filled'} />
            ) : (
              <version.S2 state={s2State} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
