import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedFirebaseDatabase = async () => {
  try {
    // 1. إضافة الإحصائيات (Metrics)
    const metrics = [
      { name: 'Speed', value: 92, category: 'Performance' },
      { name: 'Stamina', value: 85, category: 'Performance' },
      { name: 'Agility', value: 88, category: 'Performance' },
      { name: 'Strength', value: 76, category: 'Performance' },
      { name: 'Tactics', value: 90, category: 'Performance' },
      { name: 'Passing', value: 94, category: 'Performance' },
      { name: 'Shooting', value: 82, category: 'Performance' }
    ];

    for (const metric of metrics) {
      await addDoc(collection(db, 'metrics'), metric);
    }

    // 2. إضافة التمارين (Sessions)
    const sessions = [
      { title: 'Elite Tactical Drill', type: 'U-18 Elite', time: '10:00 AM', field: 'Main Pitch', coach: 'Coach Miller', status: 'Upcoming' },
      { title: 'Recovery & Stretching', type: 'All Categories', time: '02:30 PM', field: 'Wellness Zone', coach: 'Coach Miller', status: 'Upcoming' },
      { title: 'Goalkeeper Specifics', type: 'GK Squad', time: '04:00 PM', field: 'Zone B', coach: 'Coach Miller', status: 'Upcoming' },
      { title: 'Endurance Test', type: 'U-16', time: '06:00 PM', field: 'Track', coach: 'Coach Miller', status: 'Completed' }
    ];

    for (const session of sessions) {
      await addDoc(collection(db, 'sessions'), session);
    }

    // 3. إضافة اللاعبين (Players)
    const players = [
      { name: 'Zaid Al-Harbi', category: 'U-18 Elite', status: 'Active', rating: 94, role: 'PLAYER', age: 17, parentEmail: 'parent1@test.com', avatar: 'https://i.pravatar.cc/150?img=11' },
      { name: 'Omar Yassin', category: 'U-16', status: 'Active', rating: 88, role: 'PLAYER', age: 15, parentEmail: 'parent2@test.com', avatar: 'https://i.pravatar.cc/150?img=12' },
      { name: 'Sarah Ahmed', category: 'Advanced', status: 'Active', rating: 91, role: 'PLAYER', age: 16, parentEmail: 'parent3@test.com', avatar: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Yousef Mansour', category: 'U-18 Elite', status: 'Injured', rating: 85, role: 'PLAYER', age: 17, parentEmail: 'parent4@test.com', avatar: 'https://i.pravatar.cc/150?img=13' },
      { name: 'Ali Hassan', category: 'GK Squad', status: 'Active', rating: 89, role: 'PLAYER', age: 18, parentEmail: 'parent5@test.com', avatar: 'https://i.pravatar.cc/150?img=15' }
    ];

    for (const player of players) {
      await addDoc(collection(db, 'players'), player);
    }

    alert('✅ Database Seeded Successfully! You are ready for the presentation.');
  } catch (error) {
    console.error("Error seeding database: ", error);
    alert('❌ Error adding data. Check console.');
  }
};