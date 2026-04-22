import { AppState } from "../AppState.js";

const STORAGEKEY = AppState.STORAGE_KEY;
const APIKEY = AppState.SESSIONIZE_KEY;

async function _fetchData() {
  let res = await fetch(`https://sessionize.com/api/v2/${APIKEY}/view/All`);
  let data = await res.json();
  data.cached = Date.now() + 1000 * 60 * 60 * 24;
  localStorage.setItem(STORAGEKEY, JSON.stringify(data));
  return data;
}

export default class SessionizeService {
  static async loadData() {
    try {
      let data = JSON.parse(localStorage.getItem(STORAGEKEY));
      if (!data || data.cached < Date.now()) {
        data = await _fetchData();
      }

      const rooms = data.rooms || [];
      const speakers = data.speakers || [];
      const allSessions = [...(data.sessions || []), ...(data.serviceSessions || [])];
      
      const sessions = allSessions.map(s => {
        const room = rooms.find(r => String(r.id) === String(s.roomId));
        return {
          ...s,
          room: room?.name || (s.isServiceSession ? 'All Rooms' : 'TBD'),
          speakers: (s.speakers || []).map(sp => {
            const id = typeof sp === 'string' ? sp : (sp.id || sp);
            return String(id);
          })
        }
      });

      console.log('Sessionize data processed:', { rooms: rooms.length, sessions: sessions.length, speakers: speakers.length });
      AppState.rooms = rooms;
      AppState.speakers = speakers;
      AppState.sessions = sessions;

    } catch (e) {
      console.error('SessionizeService error:', e);
    }
  }
}
