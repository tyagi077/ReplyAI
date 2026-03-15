import { NewsItem } from '../types/news';

export const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Ethereum 2.0 Upgrade Completes Final Testnet Phase, Mainnet Launch Imminent',
    excerpt: 'Ethereum 2.0 upgrade has completed final testnet phase. Mainnet launch confirmed to proceed as scheduled.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'blockchain',
    publishedAt: '1 hour ago',
    author: {
      name: 'Alex Johnson',
      initials: 'AJ',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    truthScore: 92,
    sourceUrl: 'https://example.com/source',
    views: 15420,
    isFeatured: true,
    tags: ['ethereum', 'upgrade', 'blockchain']
  },
  {
    id: '2',
    title: 'New Decentralized Social Media Platform Aims to Challenge Traditional Networks',
    excerpt: 'A new Web3-powered social media platform has launched with the promise of giving users full control over their data and content, directly challenging the dominance of centralized social networks.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/7473877/pexels-photo-7473877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'social',
    publishedAt: '3 hours ago',
    author: {
      name: 'Samantha Lee',
      initials: 'SL',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    truthScore: 86,
    sourceUrl: 'https://example.com/source',
    views: 8765,
    isFeatured: false,
    tags: ['social media', 'decentralized', 'web3']
  },
  {
    id: '3',
    title: 'Major Central Banks Begin Testing CBDC Cross-Border Payment Systems',
    excerpt: 'A consortium of central banks has announced the start of testing for cross-border central bank digital currency (CBDC) payment systems, signaling a major step toward official digital currencies.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/315788/pexels-photo-315788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'finance',
    publishedAt: '5 hours ago',
    author: {
      name: 'Michael Chen',
      initials: 'MC',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    truthScore: 94,
    sourceUrl: 'https://example.com/source',
    views: 12345,
    isFeatured: false,
    tags: ['cbdc', 'central bank', 'digital currency']
  },
  {
    id: '4',
    title: 'NFT Market Shows Signs of Recovery as Trading Volume Increases 30%',
    excerpt: 'After months of declining activity, the NFT market is showing signs of recovery with a 30% increase in trading volume over the past month, led by new collections and increased institutional interest.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'nft',
    publishedAt: '12 hours ago',
    author: {
      name: 'Emily Zhang',
      initials: 'EZ',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    truthScore: 78,
    sourceUrl: 'https://example.com/source',
    views: 7643,
    isFeatured: false,
    tags: ['nft', 'market', 'trading']
  },
  {
    id: '5',
    title: 'DeFi Protocol Suffers $30M Exploit, Security Researchers Identify Vulnerability',
    excerpt: 'A prominent DeFi lending protocol has suffered a $30 million exploit due to a smart contract vulnerability. Security researchers have identified the issue and the team is working on recovery options.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/5980865/pexels-photo-5980865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'defi',
    publishedAt: '1 day ago',
    author: {
      name: 'David Wilson',
      initials: 'DW',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    truthScore: 89,
    sourceUrl: 'https://example.com/source',
    views: 22156,
    isFeatured: false,
    tags: ['defi', 'security', 'exploit']
  },
  {
    id: '6',
    title: 'New Regulation Framework Proposed for Cryptocurrency Exchanges',
    excerpt: 'Regulatory authorities have proposed a new framework for cryptocurrency exchanges, aiming to increase transparency and consumer protection while still fostering innovation in the sector.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'regulation',
    publishedAt: '2 days ago',
    author: {
      name: 'Sarah Patel',
      initials: 'SP',
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    truthScore: 91,
    sourceUrl: 'https://example.com/source',
    views: 9871,
    isFeatured: false,
    tags: ['regulation', 'cryptocurrency', 'exchanges']
  },
  {
    id: '7',
    title: 'Gaming Giants Form Consortium to Develop Interoperable Metaverse Standards',
    excerpt: 'Leading gaming companies have announced the formation of a consortium aimed at developing open standards for interoperability across metaverse platforms and experiences.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/7887470/pexels-photo-7887470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'metaverse',
    publishedAt: '3 days ago',
    author: {
      name: 'Marcus Johnson',
      initials: 'MJ',
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    truthScore: 83,
    sourceUrl: 'https://example.com/source',
    views: 11432,
    isFeatured: false,
    tags: ['metaverse', 'gaming', 'interoperability']
  },
  {
    id: '8',
    title: 'Blockchain-Based Supply Chain Solution Reduces Carbon Footprint by 40%',
    excerpt: 'A major logistics company has reported a 40% reduction in carbon emissions after implementing a blockchain-based supply chain tracking solution that optimizes routes and verifies sustainability claims.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    imageUrl: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'enterprise',
    publishedAt: '4 days ago',
    author: {
      name: 'Lisa Rodriguez',
      initials: 'LR',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    truthScore: 90,
    sourceUrl: 'https://example.com/source',
    views: 8432,
    isFeatured: false,
    tags: ['blockchain', 'supply chain', 'sustainability']
  }
];