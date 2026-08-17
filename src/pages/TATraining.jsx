import { useState } from 'react'
import SupervisorTrainingView from '../components/training/SupervisorTrainingView'
import TATrainingPlayer from '../components/training/TATrainingPlayer'

export default function TATraining({ collapsed, profiles, onSelectProfile, initialStatusFilter = 'all' }) {
  const [mode, setMode] = useState('supervisor')

  return (
    <main className={`min-h-screen px-[31px] pb-16 pt-[130px] transition-all ${collapsed ? 'ml-16' : 'ml-56'}`}>
      <div className="mx-auto max-w-[1291px]">
        {mode === 'supervisor' ? (
          <SupervisorTrainingView
            profiles={profiles}
            onSelectProfile={onSelectProfile}
            onPreviewTAView={() => setMode('ta')}
            initialStatusFilter={initialStatusFilter}
          />
        ) : (
          <TATrainingPlayer onBack={() => setMode('supervisor')} />
        )}
      </div>
    </main>
  )
}
