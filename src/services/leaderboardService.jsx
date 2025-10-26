// Mock leaderboard service - replace with Firebase later
export const getLeaderboardData = async () => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with Firebase query later
        return [
            {
                id: '1',
                rank: 1,
                name: 'Simone D\'sa',
                email: 'simone.dsa@dbit.in',
                totalPoints: 3100,
                questionsCompleted: 14
            },
            {
                id: '2',
                rank: 2,
                name: 'Adithya Menon',
                email: 'adithya.menon@dbit.in',
                totalPoints: 2950,
                questionsCompleted: 13
            },
            {
                id: '3',
                rank: 3,
                name: 'Tanmay Tajane',
                email: 'tanmay.tajane@dbit.in',
                totalPoints: 2780,
                questionsCompleted: 12
            },
            {
                id: '4',
                rank: 4,
                name: 'Ankita Gadre',
                email: 'ankita.gadre@dbit.in',
                totalPoints: 2615,
                questionsCompleted: 11
            },
            {
                id: '5',
                rank: 5,
                name: 'Rex Mercilline',
                email: 'rex.mercilline@dbit.in',
                totalPoints: 2470,
                questionsCompleted: 10
            },
            {
                id: '6',
                rank: 6,
                name: 'Piyush Mistry',
                email: 'piyush.mistry@dbit.in',
                totalPoints: 2320,
                questionsCompleted: 9
            },
            {
                id: '7',
                rank: 7,
                name: 'Nilay Shahane',
                email: 'nilay.shahane@dbit.in',
                totalPoints: 2045,
                questionsCompleted: 8
            },
            {
                id: '8',
                rank: 8,
                name: 'Irene Illikal',
                email: 'irene.illikal@dbit.in',
                totalPoints: 1890,
                questionsCompleted: 8
            },
            {
                id: '9',
                rank: 9,
                name: 'Asma Sayed',
                email: 'asma.sayed@dbit.in',
                totalPoints: 1760,
                questionsCompleted: 7
            },
            {
                id: '10',
                rank: 10,
                name: 'Aditya Sabnis',
                email: 'aditya.sabnis@dbit.in',
                totalPoints: 1625,
                questionsCompleted: 7
            },
            {
                id: '11',
                rank: 11,
                name: 'Swarup Patil',
                email: 'swarup.patil@dbit.in',
                totalPoints: 1490,
                questionsCompleted: 6
            },
            {
                id: '12',
                rank: 12,
                name: 'Anusha Gupta',
                email: 'anusha.gupta@dbit.in',
                totalPoints: 1360,
                questionsCompleted: 6
            },
            {
                id: '13',
                rank: 13,
                name: 'Pramit Kulkarni',
                email: 'pramit.kulkarni@dbit.in',
                totalPoints: 1235,
                questionsCompleted: 5
            },
            {
                id: '14',
                rank: 14,
                name: 'Tushita Patil',
                email: 'tushita.patil@dbit.in',
                totalPoints: 1110,
                questionsCompleted: 5
            },
            {
                id: '15',
                rank: 15,
                name: 'Arya Dharmadhikari',
                email: 'arya.dharmadhikari@dbit.in',
                totalPoints: 980,
                questionsCompleted: 4
            },
            {
                id: '16',
                rank: 16,
                name: 'Prathmesh Sawant',
                email: 'prathmesh.sawant@dbit.in',
                totalPoints: 855,
                questionsCompleted: 4
            },
            {
                id: '17',
                rank: 17,
                name: 'Soham Datar',
                email: 'soham.datar@dbit.in',
                totalPoints: 720,
                questionsCompleted: 3
            }
        ];

    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw new Error('Failed to load leaderboard data');
    }
};

// Additional service functions - ready for Firebase integration
export const getUserLeaderboardPosition = async (userId) => {
    try {
        const data = await getLeaderboardData();
        return data.find(user => user.id === userId) || null;
    } catch (error) {
        console.error('Error fetching user position:', error);
        throw error;
    }
};

export const getLeaderboardStats = async () => {
    try {
        const data = await getLeaderboardData();
        return {
            totalParticipants: data.length,
            averageScore: Math.round(data.reduce((sum, user) => sum + user.totalPoints, 0) / data.length),
            highestScore: Math.max(...data.map(user => user.totalPoints)),
            totalQuestions: data.reduce((sum, user) => sum + user.questionsCompleted, 0)
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};
