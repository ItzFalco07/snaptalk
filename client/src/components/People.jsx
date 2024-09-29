import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, UsersRound, MoveDownLeft, MoveUpRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const People = () => {
  const [Users, setUsers] = useState([]);
  const [UsersFilter, setUsersFilter] = useState([]);
  const [Search, setSearch] = useState('');
  const [IncommingRequests, setIncommingRequest] = useState([]);
  const [OutgoingRequests, setOutgoingRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButtons, setLoadingButtons] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog open state
  const [SelectedIncomming, setSelectedIncomming] = useState(false);
  
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const currentUser = JSON.parse(localStorage.getItem('User'));
  const colors = [
    'rgba(255, 87, 51, 0.6)',   // Red
    'rgba(51, 255, 87, 0.6)',   // Green
    'rgba(51, 87, 255, 0.6)',   // Blue
    'rgba(255, 51, 165, 0.6)',  // Pink
    'rgba(255, 184, 51, 0.6)',  // Orange
    'rgba(51, 255, 243, 0.6)',  // Cyan
    'rgba(141, 51, 255, 0.6)',  // Purple
    'rgba(51, 255, 181, 0.6)',  // Light Green
    'rgba(255, 51, 51, 0.6)',   // Bright Red
    'rgba(255, 195, 0, 0.6)'    // Yellow
  ];

  function RandomColor() {
      return colors[Math.floor(Math.random()*10)]
  }

  useEffect(() => {
    const GetUsers = async () => {
      try {
        setLoading(true);
        let allUsers = await axios.get(`${serverUrl}/getAllUsers`);
        setUsers(allUsers.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const getRequests = async () => {
      try {
        let Requests = await axios.post(`${serverUrl}/getRequests`, { userName: currentUser.Name });
        setIncommingRequest(Requests.data.incomingRequests);
        setOutgoingRequest(Requests.data.outgoingRequests);
      } catch (error) {
        console.log(error);
      }
    };

    GetUsers();
    getRequests();
  }, []);

  useEffect(() => {
    const FilterUsers = () => {
      if (Search) {
        const filteredUsers = Users.filter(user =>
          user.Name.toLowerCase().includes(Search.toLowerCase())
        );
        setUsersFilter(filteredUsers);
      } else {
        setUsersFilter(Users);
      }
    };

    FilterUsers();
  }, [Search, Users]);

  const WhichButton = (user) => {
    const isRequestSent = OutgoingRequests.includes(user.Name);
    const isLoading = loadingButtons[user.Name];

    return (
      <Button
        onClick={() => { AddFriend(user.Name) }}
        variant="primary"
        className="w-full"
        disabled={isRequestSent || isLoading}
      >
        {isLoading ? (
          <LoaderCircle className="w-4 h-4 animate-spin" />
        ) : isRequestSent ? 'Request Sent' : 'Add Friend'}
      </Button>
    );
  };

  const AddFriend = async (userTo) => {
    var userFrom = currentUser.Name;
    setLoadingButtons(prev => ({ ...prev, [userTo]: true }));

    try {
      let res = await axios.post(`${serverUrl}/sendreq`, { userFrom, userTo });
      if (res) {
        setOutgoingRequest((prev) => [...prev, userTo]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingButtons(prev => ({ ...prev, [userTo]: false }));
    }
  };

  return (
    <div className="w-full h-screen p-5 overflow-hidden">
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <div className = "flex justify-between">
            <Button variant="primary" className="flex gap-2">
              <UsersRound className="w-5 h-5" /> All People
            </Button>
            <div className="flex gap-6">
              <Button onClick={() => { setSelectedIncomming(true); setDialogOpen(true); }} variant="secondary" className="flex gap-2 relative">
                <MoveDownLeft className="w-5 h-5" /> Incoming Requests
                {IncommingRequests.length > 0 && (
                  <>
                    <div id="dot" className="w-3 h-3 bg-red-500 rounded-full absolute bottom-[-3px] right-[-3px] "></div>
                    <div id="dot" className="w-3 h-3 bg-red-500 rounded-full absolute bottom-[-3px] right-[-3px] animate-ping"></div>
                  </>
                )}
              </Button>
              <Button onClick={() => { setSelectedIncomming(false); setDialogOpen(true); }} variant="secondary" className="flex gap-2 relative">
                <MoveUpRight className="w-5 h-5" /> Outgoing Requests
                {OutgoingRequests.length > 0 && (
                  <>
                    <div id="dot" className="w-3 h-3 bg-red-500 rounded-full absolute bottom-[-3px] right-[-3px] "></div>
                    <div id="dot" className="w-3 h-3 bg-red-500 rounded-full absolute bottom-[-3px] right-[-3px] animate-ping"></div>
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent aria-describedby="custom-description">
          <AlertDialogHeader >
            <AlertDialogCancel className="w-[fit-content] absolute right-0 m-6">X</AlertDialogCancel>
            <AlertDialogTitle>{SelectedIncomming ? "Incomming Friend Requests" : "Outgoing Friend Requests"}</AlertDialogTitle>
              {SelectedIncomming ?
              <div>
                
              </div>
              : 
              <div className="w-full h-[14em]  overflow-scroll">
                {OutgoingRequests.map((request, index)=> (

                  <div key={index} id="outgoingRequest" className="w-full relative flex items-center mt-5 gap-2 px-4 h-[50px] bg-secondary rounded-[6px]">
                    <div style={{backgroundColor: RandomColor()}} className="w-[34px] h-[34px] rounded-full font-semibold flex items-center justify-center bg-red-400">{request[0]}</div>
                    <h1 className="font-semibold">{request}</h1>
                    <div id="dot" className="w-3 h-3 bg-green-500 rounded-full absolute right-[6.4em] "></div>
                    <div id="dot" className="w-3 h-3 bg-green-500 rounded-full absolute right-[6.4em] animate-ping"></div>
                    <p className="text-green-500 absolute right-6">Pending..</p>
                  </div>
                ))}
              </div>
              }
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* You can add actions here */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search User.."
        className="px-4 rounded-full h-[3em] mt-8 w-[50%] bg-secondary"
      />

      <div id="users" className="mt-8 pb-14 h-[78vh] flex gap-6 flex-wrap overflow-scroll">
        {loading ? (
          <div className="w-full flex justify-center items-center h-full">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          UsersFilter.length > 0 && UsersFilter.map((user) => (
            user.Name !== currentUser.Name && (
              <Card key={user._id} className="bg-secondary pt-4">
                <CardContent className="flex flex-col gap-3 justify-start">
                  <div style={{ backgroundColor: user.Color }} className="w-full mx-auto h-[140px] rounded-[6px]"></div>
                  <div className="flex gap-3 items-center">
                    <div style={{ backgroundColor: user.Color }} className={`rounded-full w-[44px] h-[44px] flex items-center justify-center font-semibold`}>
                      {user.Name ? `${user.Name.split(' ')[0][0]}${user.Name.split(' ')[1] ? user.Name.split(' ')[1][0] : ''}` : 'N/A'}
                    </div>
                    <div>
                      <h1 className="font-semibold">{user.Name}</h1>
                      <p>{user.Email}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {WhichButton(user)}
                </CardFooter>
              </Card>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default People;
