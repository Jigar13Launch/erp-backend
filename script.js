async function init() {
    // const Country = require('./app/models/Country');
    // const AutoIncrement = require('./app/models/AutoIncrement');
    // let autoIncrement = await AutoIncrement.findOne({
    //     table: "advocatefirms"
    // });
    // if (!autoIncrement){
    //     const AdvocateFirm = require('./app/models/AdvocateFirm');
    //     let advocateFirms = await AdvocateFirm.find({});
    //     let i=0;
    //     for (let advocateFirm of advocateFirms){
    //         i++;
    //         await AdvocateFirm.findOneAndUpdate({ _id: advocateFirm._id }, { uniqueId:i });
    //     }
    //     autoIncrement = await AutoIncrement.create({
    //         table: "advocatefirms",
    //         lastId: i
    //     })
    // }
    // autoIncrement = await AutoIncrement.findOne({
    //     table: "drafterfirms"
    // });
    // if (!autoIncrement){
    //     const DrafterFirm = require('./app/models/DrafterFirm');
    //     let drafterFirms = await DrafterFirm.find({});
    //     let i=0;
    //     for (let drafterFirm of drafterFirms){
    //         i++;
    //         await DrafterFirm.findOneAndUpdate({ _id: drafterFirm._id }, { uniqueId:i });
    //     }
    //     autoIncrement = await AutoIncrement.create({
    //         table: "drafterfirms",
    //         lastId: i
    //     })
    // }
    // autoIncrement = await AutoIncrement.findOne({
    //     table: "builderfirms"
    // });
    // if (!autoIncrement){
    //     const BuilderFirm = require('./app/models/BuilderFirm');
    //     let builderFirms = await BuilderFirm.find({});
    //     let i=0;
    //     for (let builderFirm of builderFirms){
    //         i++;
    //         await BuilderFirm.findOneAndUpdate({ _id: builderFirm._id }, { uniqueId:i });
    //     }
    //     autoIncrement = await AutoIncrement.create({
    //         table: "builderfirms",
    //         lastId: i
    //     })
    // }
    // autoIncrement = await AutoIncrement.findOne({
    //     table: "users"
    // });
    // if (!autoIncrement){
    //     const User = require('./app/models/User');
    //     let users = await User.find({ role: "Advocate Staff" });
    //     let i=0;
    //     for (let user of users){
    //         i++;
    //         await User.findOneAndUpdate({ _id: user._id }, { uniqueId:i });
    //     }
    //     autoIncrement = await AutoIncrement.create({
    //         table: "users",
    //         lastId: i
    //     })
    // }
    // let country = await Country.findOne({});
    // if (!country) {
    //     country = await Country.create({ "name": "India" });
    //     const State = require('./app/models/State');
    //     let state = await State.create({ "name": "Gujarat" ,countryId:country._id});
    //     const District = require('./app/models/District');
    //     let districts = await District.create([{ name: "Ahmedabad", stateId: state._id, countryId: country._id },
    //         { name: "Amreli", stateId: state._id, countryId: country._id },
    //         { name: "Anand", stateId: state._id, countryId: country._id },
    //         { name: "Aravalli", stateId: state._id, countryId: country._id },
    //         { name: "Banaskantha", stateId: state._id, countryId: country._id },
    //         { name: "Bharuch", stateId: state._id, countryId: country._id },
    //         { name: "Bhavnagar", stateId: state._id, countryId: country._id },
    //         { name: "Botad", stateId: state._id, countryId: country._id },
    //         { name: "Chhota", stateId: state._id, countryId: country._id },
    //         { name: "Dahod", stateId: state._id, countryId: country._id },
    //         { name: "Dang", stateId: state._id, countryId: country._id },
    //         { name: "Devbhumi", stateId: state._id, countryId: country._id },
    //         { name: "Gandhinagar", stateId: state._id, countryId: country._id },
    //         { name: "Gir", stateId: state._id, countryId: country._id },
    //         { name: "Jamnagar", stateId: state._id, countryId: country._id },
    //         { name: "Junagadh", stateId: state._id, countryId: country._id },
    //         { name: "Kheda", stateId: state._id, countryId: country._id },
    //         { name: "Kutch", stateId: state._id, countryId: country._id },
    //         { name: "Mahisagar", stateId: state._id, countryId: country._id },
    //         { name: "Mehsana", stateId: state._id, countryId: country._id },
    //         { name: "Morbi", stateId: state._id, countryId: country._id },
    //         { name: "Narmada", stateId: state._id, countryId: country._id },
    //         { name: "Navsari", stateId: state._id, countryId: country._id },
    //         { name: "Panchmahal", stateId: state._id, countryId: country._id },
    //         { name: "Patan", stateId: state._id, countryId: country._id },
    //         { name: "Porbandar", stateId: state._id, countryId: country._id },
    //         { name: "Rajkot", stateId: state._id, countryId: country._id },
    //         { name: "Sabarkantha", stateId: state._id, countryId: country._id },
    //         { name: "Surat", stateId: state._id, countryId: country._id },
    //         { name: "Surendranagar", stateId: state._id, countryId: country._id },
    //         { name: "Tapi", stateId: state._id, countryId: country._id },
    //         { name: "Vadodara", stateId: state._id, countryId: country._id },
    //         { name: "Valsad", stateId: state._id, countryId: country._id }]);
    //     let cities = JSON.parse(JSON.stringify(districts))
    //     cities = cities.map((x)=>{
    //         return {
    //             name:x.name,
    //             stateId:x.stateId,
    //             countryId:x.countryId,
    //             districtId:x._id,
    //         }
    //     })
    //     const City = require('./app/models/City');
    //     const RegistrarOffice = require('./app/models/RegistrarOffice');
    //     cities = await City.create(cities);
        
    //     let registrarOffices = [{ district: "Ahmedabad", name: "Ahmedabad-1(City)", address: "Juni Civil Compound,Gheekanta,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-2(Vadaj)", address: "First Floor,Gujarat Housing Board,Pragatinagar, Naranpura, Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-3(Memnagar)", address: "Hostel Building,Polytechnic Compound,Ambavadi, Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-4(Paldi)", address: "8th Floor,‘B’ Block, Multi-Storied Building,LalDarwaja,Ahmedabad." },
    //         { district: "Ahmedabad", name: "Ahmedabad-5(Narol)", address: "Khokhra Janseva Kendra,Near Ramji Temple,Khokhra- Maninagar,Ahmedabad" },
    //         { district: "Ahmedabad", name: " Ahmedabad-6(Naroda)", address: "New Mental Compound, Block No.O/4,Nr. Rojgaar Vinimay Office,Meghaninagar,Ahmedabad." },
    //         { district: "Ahmedabad", name: "Ahmedabad-7(Odhav)", address: "Nikol Janseva Kendra,Nikol,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-8(Shola)", address: "Mojani Seva Sadan,Bhimjipura,Vadaj,Ahmedabad" },
    //         { district: "Ahmedabad", name: " Ahmedabad-9(Bopal)", address: "Gram Panchayat Office,Bopal,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-10(Vejalpur)", address: "8th Floor,‘B’ Block, Multi-Storied Building,LalDarwaja,Ahmedabad." },
    //         { district: "Ahmedabad", name: "Ahmedabad-11(Aslali)", address: "Khokhra Janseva Kendra,Near Ramji Temple,Khokhra- Maninagar,Ahmedabad" },
    //         { district: "Ahmedabad", name: " Ahmedabad-12(Nikol)", address: "Nikol Janseva Kendra,Nikol,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-13 (City Taluko-Agri.)", address: "Janseva Kendra,Collector Office Compound,Subhash Bridge Circle,Ashram Road,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ahmedabad-14 (Daskroi Taluko-Agri.)", address: "Janseva Kendra,Collector Office Compound,Subhash Bridge Circle,Ashram Road,Ahmedabad" },
    //         { district: "Ahmedabad", name: "Viramgam", address: "Mamlatdar Office Compound,Viramgam, Dist: Ahmedabad." },
    //         { district: "Ahmedabad", name: "Sanand", address: "Mamlatdar Office Compound,Sanand, Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Dholka", address: "Mamlatdar Office Compound,Dholka, Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Dhandhuka", address: " C/o. Mamlatdar Office,Dhandhuka,Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Mandal", address: "e Dhara Centre,Mamlatdar Office Compound, Mandal, Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Detroj(Rampura)", address: "e Dhara Centre,Mamlatdar Office Compound, Detroj(Rampura),Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Bavla", address: "e Dhara Centre,Mamlatdar Office Compound, Bavla, Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: "Ranpur", address: "e Dhara Centre,Mamlatdar Office Compound, Ranpur,Dist: Ahmedabad" },
    //         { district: "Ahmedabad", name: " Barwala", address: "e Dhara Centre,Mamlatdar Office Compound, Barwala,Dist: Ahmedabad" },
    //         { district: "Amreli", name: "Amreli", address: "Nr. Library, Amreli" },
    //         { district: "Amreli", name: "Dhari", address: "Mamlatdar Office Compound,Dhari,Dist :Amreli" },
    //         { district: "Amreli", name: "Babra", address: "Mamlatdar Office Compound, Babra,Dist :Amreli" },
    //         { district: "Amreli", name: "Rajula", address: "Mamlatdar Office Compound, Rajula,Dist :Amreli" },
    //         { district: "Amreli", name: "Lathi", address: "Nr. Treasury Office,Lathi,Dist : Amreli" },
    //         { district: "Amreli", name: "Vadiya", address: "Court Compound,Vadiya,Dist :Amreli" },
    //         { district: "Amreli", name: " Savarkundla", address: "Darbar Gadh, Savarkundla, Dist :Amreli" },
    //         { district: "Amreli", name: "Liliya", address: "e Dhara Centre,Mamlatdar Office Compound,Liliya, Dist: Amreli" },
    //         { district: "Amreli", name: "Khambha", address: "e Dhara Centre,Mamlatdar Office Compound, Khambha,Dist: Amreli" },
    //         { district: "Amreli", name: " Jhafrabad", address: "e Dhara Centre,Mamlatdar Office Compound, Jhafrabad,Dist: Amreli" },
    //         { district: "Amreli", name: "Bagsara", address: "e Dhara Centre,Mamlatdar Office Compound,Bagsara, Dist: Amreli" },
    //         { district: "Anand", name: " Anand", address: " Mamlatdar Office,Anand" },
    //         { district: "Anand", name: "Khambhat", address: "Seva Sadan Building,Khambhat,Dist: Anand" },
    //         { district: "Anand", name: "Petlad", address: "Mamlatdar Office Compound, Petlad,Dist: Anand" },
    //         { district: "Anand", name: " Borsad", address: "Mamlatdar Office Compound,Borsad,Dist: Anand" },
    //         { district: "Anand", name: "Umreth", address: "e Dhara Centre,Mamlatdar Office Compound,Umreth, Dist: Anand" },
    //         { district: "Anand", name: "Tarapur", address: "e Dhara Centre,Mamlatdar Office Compound,Tarapur, Dist: Anand" },
    //         { district: "Anand", name: " Sojitra", address: "e Dhara Centre,Mamlatdar Office Compound,Sojitra, Dist: Anand" },
    //         { district: "Anand", name: "Ankalav", address: "e Dhara Centre,Mamlatdar Office Compound,Ankalav, Dist: Anand" },
    //         { district: "Banaskantha", name: "Palanpur", address: "Joravar Palace,Nr. Jilla Udhyog Kendra, Kazi Road,Palanpur " },
    //         { district: "Banaskantha", name: "Tharad", address: "Mamlatdar Office Compound,Tharad, Dist:Banaskantha" },
    //         { district: "Banaskantha", name: " Danta", address: "Mamlatdar Office Compound,Danta,Dist:Banaskantha" },
    //         { district: "Banaskantha", name: "Deesa", address: "Mamlatdar Office Compound,Deesa,Dist:Banaskantha" },
    //         { district: "Banaskantha", name: "Diyodar", address: "Mamlatdar Office Compound,Diyodar,Dist:Banaskantha" },
    //         { district: "Banaskantha", name: "Amirgadh", address: "e Dhara Centre,Mamlatdar Office Compound, Amirgadh,Dist: Banaskantha" },
    //         { district: "Banaskantha", name: " Vav", address: "e Dhara Centre,Mamlatdar Office Compound, Vav,Dist: Banaskantha" },
    //         { district: "Banaskantha", name: "Vadgam", address: " Dhanera" },
    //         { district: "Banaskantha", name: " Dantiwada", address: "e Dhara Centre,Mamlatdar Office Compound, Dantiwada,Dist: Banaskantha" },
    //         { district: "Banaskantha", name: "Bhabhar", address: "e Dhara Centre,Mamlatdar Office Compound, Bhabhar,Dist: Banaskantha" },
    //         { district: "Banaskantha", name: "Kankarej", address: "e Dhara Centre,Mamlatdar Office Compound, Kankarej,Dist: Banaskantha" },
    //         { district: "Bharuch", name: "Bharuch", address: "‘B’ Block,Ground Floor,New Collector Office, Bharuch" },
    //         { district: "Bharuch", name: " Ankleshwar", address: "Ras Dhar Cold Drinks, Union Bank of India Building, Station Road,Ankleshwar,Dist : Bharuch" },
    //         { district: "Bharuch", name: "Vagra", address: "Mamlatdar Office Compound,Vagra,Dist : Bharuch" },
    //         { district: "Bharuch", name: "Jambusar", address: "Mamlatdar Office Compound,Jambusara, Dist : Bharuch" },
    //         { district: "Bharuch", name: "Jhaghadia", address: " Mamlatdar Office Compound,Jhaghadia,Dist : Bharuch" },
    //         { district: "Bharuch", name: " Amod", address: "Mamlatdar Office Compound,Amod,Dist : Bharuch" },
    //         { district: "Bharuch", name: "Hansot", address: "e Dhara Centre,Mamlatdar Office Compound, Hansot,Dist: Bharuch" },
    //         { district: "Bharuch", name: "Valiya", address: "e Dhara Centre,Mamlatdar Office Compound, Valiya,Dist: Bharuch" },
    //         { district: "Bhavnagar", name: "Bhavnagar-1(City)", address: "Motibaug,Collector Office Compound,Bhavnagar" },
    //         { district: "Bhavnagar", name: "Bhavnagar-2(Ruva) ", address: "Motibaug,Collector Office Compound,Bhavnagar" },
    //         { district: "Bhavnagar", name: "Bhavnagar-3(Chitra)", address: "4th Floor,Business Centre,Nr.Ghogha Gate,Bhavnagar" },
    //         { district: "Bhavnagar", name: "Talaja", address: "Shastrinagar,Talaja,Dist: Bhavnagar " },
    //         { district: "Bhavnagar", name: "Gadhada", address: "Mamlatdar Office Compound,Gadhada,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: " Palitana", address: "Nr. S.T. Depot, Mahavirnagar,Palitana,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: "Mahuva", address: "Mamlatdar Office Compound,Mahuva,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: "Shihor", address: "Zululal Complex,Station Road,Opp: S.B.S.,Shihor, Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: " Botad", address: "Paliyad Road,Jawarnagar,Botad,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: "Ghogha", address: "e Dhara Centre,Mamlatdar Office Compound, Ghogha,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: " Gariyadhar", address: "e Dhara Centre,Mamlatdar Office Compound, Gariyadhar,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: "Umrala", address: "e Dhara Centre,Mamlatdar Office Compound, Umrala,Dist: Bhavnagar" },
    //         { district: "Bhavnagar", name: "Valabhipur", address: "e Dhara Centre,Mamlatdar Office Compound, Valabhipur,Dist: Bhavnagar" },
    //         { district: "Dahod", name: " Dahod", address: "Mamlatdar Office Compound,Nr. Godi Vistar Nagarpalika Office,Dahod" },
    //         { district: "Dahod", name: "Devgadh-Bariya", address: "Mamlatdar Office Compound,Devgadh-Bariya, Dist: Dahod" },
    //         { district: "Dahod", name: "Garbada", address: "e Dhara Centre,Mamlatdar Office Compound, Garbada,Dist: Dahod" },
    //         { district: "Dahod", name: "Limkheda", address: "e Dhara Centre,Mamlatdar Office Compound, Limkheda,Dist: Dahod" },
    //         { district: "Dahod", name: "Dhanpur", address: "e Dhara Centre,Mamlatdar Office Compound, Dhanpur,Dist: Dahod" },
    //         { district: "Dahod", name: "Fatepura", address: "e Dhara Centre,Mamlatdar Office Compound, Fatepura,Dist: Dahod" },
    //         { district: "Gandhinagar", name: "Gandhinagar ", address: "Ground Floor,Jilla Seva Sadan,Sector-11, Gandhinagar" },
    //         { district: "Gandhinagar", name: "Kalol", address: "Nr. Matvakuva,Juno Choro,Kalol,Dist: Gandhinagar" },
    //         { district: "Gandhinagar", name: " Dehgam", address: "Mamlatdar Office Compound,Dehgam,Dist: Gandhinagar" },
    //         { district: "Gandhinagar", name: "Mansa", address: "e Dhara Centre,Mamlatdar Office Compound, Mansa,Dist: Gandhinagar" },
    //         { district: "Jamnagar", name: "Jamnagar-1", address: "Lal Bunglow, Collector Office Compoud,Jamnagar" },
    //         { district: "Jamnagar", name: "Jamnagar-2", address: "Lal Bunglow, Collector Office Compoud,Jamnagar" },
    //         { district: "Jamnagar", name: "Kalavad", address: " Mamlatdar Office Compound,Kalavad,Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Khambhalia", address: "Mamlatdar Office Compound,Khambhalia, Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Kalyanpur", address: "Peetta Bailana House,Room No.2,Kalyanpur, Dist: Jamnagar " },
    //         { district: "Jamnagar", name: "Jam-jodhpur", address: "Revenue Building,Jam-jodhpur,Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Bhanwad", address: "Near Veral Naka,Dr. Bharatbhai Varothi Building, Bhanvad,Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Jodiya", address: "Revenue Building,Mamlatdar Office Compound, Jodiya,Dist: Jamnagar " },
    //         { district: "Jamnagar", name: "Dwarka", address: "e Dhara Centre,Mamlatdar Office Compound, Dwarka,Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Lalpur", address: "e Dhara Centre,Mamlatdar Office Compound, Lalpur,Dist: Jamnagar" },
    //         { district: "Jamnagar", name: "Dhrol", address: "e Dhara Centre,Mamlatdar Office Compound, Dhrol,Dist: Jamnagar" },
    //         { district: "Junagadh", name: "Junagadh", address: "Govt.Ayurvedic Hospital Building,Junagadh" },
    //         { district: "Junagadh", name: " Keshod", address: "Taluka Panchayat Office Compound,Keshod, Dist : Junagadh" },
    //         { district: "Junagadh", name: "Una", address: "Purva Dyanand Society,Una,Dist : Junagadh" },
    //         { district: "Junagadh", name: "Manavadar", address: "Balsara Sheri, Manavadar,Dist : Junagadh" },
    //         { district: "Junagadh", name: "Mangrol", address: "Mamlatdar Office Compound,Mangrol, Dist : Junagadh" },
    //         { district: "Junagadh", name: "Maliya-Hatina", address: "Taluka Panchayat Office Compound,Maliya-Hatina, Dist : Junagadh" },
    //         { district: "Junagadh", name: "Visavadar", address: "Taluka Panchayat Office Compound,Opp: Ganjivada Police Station,Visavadar, Dist : Junagadh " },
    //         { district: "Junagadh", name: "Veraval", address: "Nr.Nagarpalika,Akhana Building,Opp: Library, Bander Road, Veravala,Dist : Junagadh" },
    //         { district: "Junagadh", name: "Vanthli", address: "Mamlatdar Office Compound,Vanthli,Dist: Junagadh" },
    //         { district: "Junagadh", name: "Kodinar", address: "Mamlatdar Office Compound,Kodinar,Dist: Junagadh" },
    //         { district: "Junagadh", name: "Bhesan", address: "e Dhara Centre,Mamlatdar Office Compound, Bhesan,Dist: Junagadh" },
    //         { district: "Junagadh", name: "Mendarda", address: "e Dhara Centre,Mamlatdar Office Compound, Mendarda,Dist: Junagadh" },
    //         { district: "Junagadh", name: "Talala", address: "e Dhara Centre,Mamlatdar Office Compound, Talala,Dist: Junagadh" },
    //         { district: "Junagadh", name: " Sutrapada", address: "e Dhara Centre,Mamlatdar Office Compound, Sutrapada,Dist: Junagadh" },
    //         { district: "Kutch", name: " Bhuj", address: "Opp: Reliance Hall, Collector Office, Bhuj" },
    //         { district: "Kutch", name: "Gandhidham", address: "Brahmasamaj Building, Plot No.106,Sector 8, Opp: G.I.D.C.,Gandhidham,Dist: Kutch" },
    //         { district: "Kutch", name: "Nakhatrana", address: "Mamlatdar Office Compound,Nakhtrana,Dist: Kutch" },
    //         { district: "Kutch", name: "Anjar", address: "Mamlatdar Office Compound,Anjar,Dist: Kutch" },
    //         { district: "Kutch", name: "Mandvi", address: "Opp: Jain Darmashala,Mandvi,Dist: Kutch" },
    //         { district: "Kutch", name: " Rapar", address: "Mamlatdar Office,Rapar,Dist: Kutch" },
    //         { district: "Kutch", name: "Mundra", address: "Juni Mamlatdar Office Com pound,Mundra, " },
    //         { district: "Kutch", name: "Bhachau", address: " Mamlatdar Office Compound, Bhachau,Dist: Kutch" },
    //         { district: "Kutch", name: "Naliya", address: "e Dhara Centre,Mamlatdar Office Compound, Naliya,Dist: Kutch" },
    //         { district: "Kutch", name: " Lakhpat", address: "e Dhara Centre,Mamlatdar Office Compound, Lakhpat,Dist: Kutch" },
    //         { district: "Mehsana", name: "Mehsana", address: "Rajmahal Compound,Mehsana" },
    //         { district: "Mehsana", name: "Visnagar", address: "Mamlatdar Office Compound, Darbar Road,Visnagar, Dist: Mehsana" },
    //         { district: "Mehsana", name: "Kadi", address: "Mahajan Hospital House,Tran Batti Area,Kadi, Dist: Mehsana" },
    //         { district: "Mehsana", name: "Kheralu", address: "Mamlatdar Office Compound,Kheralu,Dist: Mehsana" },
    //         { district: "Mehsana", name: " Unjha", address: "Mamlatdar Office Compound,Unjha,Dist: Mehsana" },
    //         { district: "Mehsana", name: "Vijapur", address: " Mamlatdar Office Compound,Vijapur,Dist: Mehsana" },
    //         { district: "Mehsana", name: "Becharaji", address: "e Dhara Centre,Mamlatdar Office Compound, Becharaji,Dist: Mehsana" },
    //         { district: "Mehsana", name: "Vadnagar", address: "e Dhara Centre,Mamlatdar Office Compound, Vadnagar,Dist: Mehsana" },
    //         { district: "Mehsana", name: "Satlasana", address: "e Dhara Centre,Mamlatdar Office Compound, Satlasana,Dist: Mehsana" },
    //         { district: "Kheda", name: "Nadiad", address: "Sardar Patel Bhavan,‘D’ Block,Ground Floor, Nadiad" },
    //         { district: "Kheda", name: "Kheda", address: "Treasury Office Compound,Kheda,Dist : Nadiad" },
    //         { district: "Kheda", name: "Kapadwanj", address: "Mamlatdar Office Compound,Kapadwanj, Dist : Nadiad" },
    //         { district: "Kheda", name: "Thasara", address: "Mamlatdar Office Compound,Thasara,Dist : Nadiad" },
    //         { district: "Kheda", name: "Balasinor", address: "Mamlatdar Office Compound,Balasinor,Dist : Nadiad" },
    //         { district: "Kheda", name: "Mahemadavad", address: "Mamlatdar Office Compound,Opp: Police Station, Mahemadavad,Dist : Nadiad" },
    //         { district: "Kheda", name: " Matar", address: "Mamlatdar Office Compound,Matar,Dist : Nadiad" },
    //         { district: "Kheda", name: " Mahudha", address: "e Dhara Centre,Mamlatdar Office Compound, Mahudha,Dist: Nadiad" },
    //         { district: "Kheda", name: "Kathlal", address: "e Dhara Centre,Mamlatdar Office Compound, Kathlal,Dist: Nadiad" },
    //         { district: "Kheda", name: "Virpur", address: "e Dhara Centre,Mamlatdar Office Compound, Virpur,Dist: Nadiad" },
    //         { district: "Narmada", name: "Nandod", address: "Nr. Lal Tower,Rajpipla,Dist: Narmada" },
    //         { district: "Narmada", name: "Tilakwada", address: "Mamlatdar Office Compound,Tilakwada,Dist: Narmada" },
    //         { district: "Narmada", name: "Sagbara", address: "e Dhara Centre,Mamlatdar Office Compound, Sagbara,Dist: Narmada" },
    //         { district: "Narmada", name: "Dediyapada", address: "e Dhara Centre,Mamlatdar Office Compound, Dediyapada,Dist: Narmada" },
    //         { district: "Navsari", name: "Navsari", address: "1st Floor,“C” Block,Multi-storied Building, Juna Dhana,Navsari" },
    //         { district: "Navsari", name: "Chikhli", address: "Mamlatdar Office Compound,Chikhli,Dist : Navsari" },
    //         { district: "Navsari", name: "Gandevi", address: " Mamlatdar Office Compound,Gandevi,Dist : Navsari" },
    //         { district: "Navsari", name: "Jalalpor", address: "e Dhara Centre,Mamlatdar Office Compound, Jalalpor,Dist: Navsari" },
    //         { district: "Navsari", name: "Vansada", address: "e Dhara Centre,Mamlatdar Office Compound, Vansada,Dist: Navsari" },
    //         { district: "Panchmahal", name: "Godhra", address: " Mamlatdar Office Compound, Godhra" },
    //         { district: "Panchmahal", name: "Lunawada", address: "Mamlatdar Office Compound, Lunawada, Dist: Panchmahal" },
    //         { district: "Panchmahal", name: " Kaalol", address: "Mamlatdar Office Compound,Kaalol, Dist:Panchmahal" },
    //         { district: "Panchmahal", name: "Santrampur", address: "Mamlatdar Office Compound, Santrampur, Dist:Panchmahal" },
    //         { district: "Panchmahal", name: " Jhalod", address: "e Dhara Centre,Mamlatdar Office Compound, Jhalod,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: "Morwa-Hadaf", address: "e Dhara Centre,Mamlatdar Office Compound, Morwa-Hadaf,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: "Shahera", address: "e Dhara Centre,Mamlatdar Office Compound, Shahera,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: "Khanpur", address: "e Dhara Centre,Mamlatdar Office Compound, Khanpur,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: "Halol", address: "e Dhara Centre,Mamlatdar Office Compound, Halol,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: " Jambughoda", address: "e Dhara Centre,Mamlatdar Office Compound, Jambughoda,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: "Ghoghamba", address: "e Dhara Centre,Mamlatdar Office Compound, Ghoghamba,Dist: Panchmahal" },
    //         { district: "Panchmahal", name: " Kadana", address: "e Dhara Centre,Mamlatdar Office Compound, Kadana,Dist: Panchmahal" },
    //         { district: "Patan", name: " Patan", address: " Jilla Sevasadan, Rajmahal Road,Patan" },
    //         { district: "Patan", name: "Radhanpur", address: "First Floor,Prant Office,Nr.Court,Radhanpur, Dist: Patan" },
    //         { district: "Patan", name: "Chanasma", address: "Mamlatdar Office Compound,Chanasma,Dist: Patan" },
    //         { district: "Patan", name: "Harij", address: "Mamlatdar Office Compound,Harij,Dist: Patan" },
    //         { district: "Patan", name: " Siddhpur", address: "Mamlatdar Office Compound,Siddhpur,Dist: Patan" },
    //         { district: "Patan", name: "Santalpur", address: "e Dhara Centre,Mamlatdar Office Compound, Santalpur,Dist: Patan" },
    //         { district: "Patan", name: "Sami", address: "e Dhara Centre,Mamlatdar Office Compound, Sami,Dist: Patan" },
    //         { district: "Porbandar", name: " Porbandar", address: "Collector Office Compound, Sudama Chowk, Porbandar" },
    //         { district: "Porbandar", name: "Ranavav", address: "e Dhara Centre,Mamlatdar Office Compound, Ranavav,Dist: Porbandar" },
    //         { district: "Porbandar", name: "Kutiyana", address: "e Dhara Centre,Mamlatdar Office Compound, Kutiyana,Dist: Porbandar" },
    //         { district: "Rajkot", name: "Rajkot-1(City)", address: "Collector Office Compound,Rajkot" },
    //         { district: "Rajkot", name: "Rajkot-2(Ratanpar)", address: "Dharmendrasinh College Compound,Ground Floor, Rajkot" },
    //         { district: "Rajkot", name: " Rajkot-3(Kothariya)", address: "Dharmendrasinh College Compound,Ground Floor, Rajkot" },
    //         { district: "Rajkot", name: "Rajkot-4(Raiya)", address: "Dharmendrasinh College Compound,Ground Floor, Rajkot" },
    //         { district: "Rajkot", name: "Gondal", address: "Monghiba High School-College Compound,Ground Floor,Gondal,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Jasdan", address: "Mamlatdar Office Compound,Jasdan,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Jetpur", address: "Juna Court Building,Behind Telegraph Office,Jetpur, Dist : Rajkot" },
    //         { district: "Rajkot", name: "Dhoraji", address: "Near Darbar Gadh,Dhoraji,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Upleta", address: "Bada Bajrang Road,Upleta,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Morbi", address: "Seva Sadan,Morbi,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Wankaner", address: "Juna Darbar Gadh,Wankaner,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Padadhari", address: "e Dhara Centre,Mamlatdar Office Compound, Padadhari,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Kotada-Sangani", address: "e Dhara Centre,Mamlatdar Office Compound, Kotada-Sangani,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Lodhika", address: "e Dhara Centre,Mamlatdar Office Compound, Lodhika,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Jamkandorana", address: "e Dhara Centre,Mamlatdar Office Compound, Jamkandorana,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Maliya-Miyana", address: "e Dhara Centre,Mamlatdar Office Compound, Maliya-Miyana,Dist : Rajkot" },
    //         { district: "Rajkot", name: "Tankara", address: "e Dhara Centre,Mamlatdar Office Compound, Tankara,Dist : Rajkot" },
    //         { district: "Sabarkantha", name: "Himmatnagar", address: "‘C’ Block,2nd Floor,Multi-storied Building, Himmatnagar" },
    //         { district: "Sabarkantha", name: "Modasa", address: "Meghraj Road,Modasa,Dist :Sabarkantha" },
    //         { district: "Sabarkantha", name: "Idar", address: "Near City Survey Office,Idar,Dist :Sabarkantha" },
    //         { district: "Sabarkantha", name: "Prantij", address: "Mamlatdar Office Compound,Nr.Police Station, Prantij,Dist : Sabarkantha " },
    //         { district: "Sabarkantha", name: "Bhiloda", address: "Nr. Prerana School,Bhiloda,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: " Bayad", address: "Gabat Road,Nr.Water Tank,Bayad,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Meghara", address: "e Dhara Centre,Mamlatdar Office Compound, Megharaj,Dist : Sabarkantha Sabarkantha5 SABARKANTHA Malpur e Dhara Centre,Mamlatdar Off" },
    //         { district: "Sabarkantha", name: "Malpur", address: "e Dhara Centre,Mamlatdar Office Compound, Malpur,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Khedbrahma", address: "e Dhara Centre,Mamlatdar Office Compound, Khedbrahma,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Vadali", address: "e Dhara Centre,Mamlatdar Office Compound, Vadali,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Talod", address: "e Dhara Centre,Mamlatdar Office Compound, Talod,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Vijaynagar", address: "e Dhara Centre,Mamlatdar Office Compound, Vijaynagar,Dist : Sabarkantha" },
    //         { district: "Sabarkantha", name: "Dhansura", address: "e Dhara Centre,Mamlatdar Office Compound, Dhansura,Dist : Sabarkantha " },
    //         { district: "Surat", name: "Surat-1(Athwa)", address: "‘A’ Block, 6th Floor,Multi-storied Building, Nanpura,Surat" },
    //         { district: "Surat", name: "Surat-2(Udhna)", address: "‘A’ Block, 7th Floor, Multi-storied Building, Nanpura,Surat" },
    //         { district: "Surat", name: "Surat-3(Navagam)", address: "‘A’ Block, 4th Floor, Multi-storied Building, Nanpura,Surat " },
    //         { district: "Surat", name: "Surat-4(Katargam)", address: "‘A’ Block, 4th Floor, Multi-storied Building, Nanpura,Surat" },
    //         { district: "Surat", name: "Kamrej", address: "Mamlatdar Office Compound,Kamrej,Dist: Surat" },
    //         { district: "Surat", name: "Bardoli", address: "Mamlatdar Office Compound,Bardoli,Dist: Surat" },
    //         { district: "Surat", name: "Mahuva", address: "Mamlatdar Office Compound,Mahuva,Dist: Surat" },
    //         { district: "Surat", name: "Mangrol", address: "Mamlatdar Office Compound,Mangrol,Dist: Surat" },
    //         { district: "Surat", name: "Olpad", address: "Mamlatdar Office Compound,Olpad, Dist: Surat" },
    //         { district: "Surat", name: "Palsana", address: "Mamlatdar Office Compound,Palsana,Dist: Surat" },
    //         { district: "Surat", name: "Mandvi", address: "Mamlatdar Office Compound, Mandvi,Dist: Surat" },
    //         { district: "Surat", name: "Umarpada", address: "e Dhara Centre,Mamlatdar Office Compound, Umarpada,Dist : Surat" },
    //         { district: "Surendranagar", name: "Surendranagar", address: "Block ‘C’, Multi-storied Building,Kheradi Road, Surendranagar." },
    //         { district: "Surendranagar", name: "Dasada-Patdi", address: "Mamlatdar Office Compound, Darbargadh, Dasada-Patdi,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Dhrangadhra", address: "Mamlatdar Office Compound,Man Mehlat, Dhrangadhra,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Muli", address: "Mamlatdar Office Compound,Opp: Court, Muli,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Limbdi", address: "Near Ajmera Nivas,Near Tower,Limbdi, Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Wadhwan", address: "Hathi-Khana, Dhobi Pole,Wadhwan, Dist:Surendranagar" },
    //         { district: "Surendranagar", name: "Halwad", address: "Mamlatdar Office Compound,Halwad, Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Chotila", address: "e Dhara Centre,Mamlatdar Office Compound, Chotila,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Sayla", address: "e Dhara Centre,Mamlatdar Office Compound, Sayla,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Chuda", address: "e Dhara Centre,Mamlatdar Office Compound, Chuda,Dist: Surendranagar" },
    //         { district: "Surendranagar", name: "Lakhtar", address: "e Dhara Centre,Mamlatdar Office Compound, Lakhtar,Dist: Surendranagar" },
    //         { district: "Tapi", name: "Vyara", address: "Mamlatdar Office Compound,Vyara" },
    //         { district: "Tapi", name: " Songadh", address: "e Dhara Centre,Mamlatdar Office Compound, Songadh,Dist : Tapi" },
    //         { district: "Tapi", name: "Nizar", address: "e Dhara Centre,Mamlatdar Office Compound, Nizar,Dist : Tapi" },
    //         { district: "Tapi", name: "Uchchhal", address: "e Dhara Centre,Mamlatdar Office Compound, Uchchhal,Dist : Tapi" },
    //         { district: "Tapi", name: "Valod", address: "e Dhara Centre,Mamlatdar Office Compound, Valod,Dist : Tapi" },
    //         { district: "Vadodara", name: " Vadodara-1(City)", address: "‘E’ Block,6th Floor,Kuber Bhavan,Vadodara" },
    //         { district: "Vadodara", name: "Vadodara-2(Danteshwar)", address: "‘E’ Block,6th Floor,Kuber Bhavan,Vadodara" },
    //         { district: "Vadodara", name: "Vadodara-3(Akota)", address: "‘E’ Block,6th Floor,Kuber Bhavan,Vadodara" },
    //         { district: "Vadodara", name: "Vadodara-4(Gorwa)", address: "‘E’ Block,6th Floor,Kuber Bhavan,Vadodara" },
    //         { district: "Vadodara", name: "Jetpur-Pavi", address: "Khetivadi Bazar Utpanna Samiti Building,Jetpur-Pavi, Dist: Vadodara" },
    //         { district: "Vadodara", name: "Dabhoi", address: " Mamlatdar Office Compound,Dabhoi,Dist: Vadodara" },
    //         { district: "Vadodara", name: "Padra", address: "Mamlatdar Office Compound,Padra,Dist: Vadodara" },
    //         { district: "Vadodara", name: "Karjan", address: "Mamlatdar Office Compound,Karjan,Dist: Vadodara" },
    //         { district: "Vadodara", name: "Waghodia", address: "Mamlatdar Office Compound,Waghodia, Dist: Vadodara" },
    //         { district: "Vadodara", name: "Savli", address: " Mamlatdar Office Compound,Savli,Dist: Vadodara" },
    //         { district: "Vadodara", name: "Sankheda", address: "Mamlatdar Office Compound,Sankheda, Dist: Vadodara" },
    //         { district: "Vadodara", name: " Shinor", address: " Mamlatdar Office Compound,Shinor,Dist: Vadodara" },
    //         { district: "Vadodara", name: "Chhota Udepur", address: "e Dhara Centre,Mamlatdar Office Compound, Chhota Udepur,Dist : Vadodara" },
    //         { district: "Vadodara", name: "Kawant", address: "e Dhara Centre,Mamlatdar Office Compound, Kawant,Dist : Vadodara" },
    //         { district: "Vadodara", name: "Nasvadi", address: "e Dhara Centre,Mamlatdar Office Compound, Nasvadi,Dist : Vadodara" },
    //         { district: "Valsad", name: "Valsad", address: "Nr. Mamlatdar Office Compound,Nondhani Bhavan,Near Eye Hospital,Valsad" },
    //         { district: "Valsad", name: "Pardi", address: "Mamlatdar Office Compound, Opp: N.H. 8,Pardi, Dist : Valsad" },
    //         { district: "Valsad", name: " Dharampur", address: "e Dhara Centre,Mamlatdar Office Compound, Dharampur,Dist : Valsad" },
    //         { district: "Valsad", name: " Kaparada ", address: "e Dhara Centre,Mamlatdar Office Compound, Kaparada,Dist : Valsad" },
    //         { district: "Valsad", name: "Umargam", address: "e Dhara Centre,Mamlatdar Office Compound, Umargam,Dist : Valsad" },
    //         { district: "Dang", name: " Ahwa", address: "Mamlatdar Office Compound,Dang(Ahwa)" }]
    //     registrarOffices = registrarOffices.map((x) => {
    //         let district = districts.find((y) => y.name == x.district);
    //         if (district) {
    //             x.districtId = district._id
    //         }
    //         return x;
    //     })
    //     registrarOffices = await RegistrarOffice.create(registrarOffices);
    // }
    const User = require('./app/models//User');
    let user = await User.findOne({});
    if (!user) {
        await User.create({
            "email": "launchpad712@gmail.com",
            "name": "Super Admin Launchpad",
            "companyName":"Launchpad",
            "loginId": "Admin",
            "address":"Ahmedabad",
            "password": "123456",
            "phone":"9999999999"
        });
    }
    const Email = require('./app/models/Email');
    let email = await Email.findOne({});
    if (!email) {
        await Email.create([{
            "unique": "WELCOME",
            "title": "Welcome To Client Connect!",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n            <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n            <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                    <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                            <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                            <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                            </div>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            Dear %NAME%, <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Congratulations on taking the first step towards a paperless office. Your login details are as follows: <br><br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            URL: <a href=\"%FRONT_URL%\">%FRONT_URL%</a><br>\n                                            Username: %USERNAME%<br>\n                                                Password: %PASSWORD%</td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Warm Regards,<br>\n                                            Team Client Connect\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            If you received this email by mistake, simply delete it.\n                                        </td>\n                                    </tr>\n                                </tbody></table>\n                            </td>\n                        </tr>\n                    </tbody></table>\n                    <div style=\"text-align: center; margin: 0px auto;\">\n                        <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                            <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                        </ul>\n                        <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tbody></table>"
        }, {
            "unique": "NEW OTP",
            "title": "New Otp",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n            <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n                <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                    <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                            <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                                <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                    <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                                <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                    <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                                New OTP\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; color: #878a99; line-height: 1.5; box-sizing: border-box; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\">\n                                                Please don't share it with anyone.\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" itemprop=\"handler\" itemscope=\"\" itemtype=\"http://schema.org/HttpActionHandler\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\"><a href=\"javascript:void(0);\" itemprop=\"url\" style=\"font-family: Roboto, sans-serif; box-sizing: border-box; font-size: 0.8125rem; font-weight: 400; color: rgb(255, 255, 255); text-decoration: none; text-align: center; cursor: pointer; display: inline-block; border-radius: 0.25rem; text-transform: capitalize; background: rgb(10, 179, 156); margin: 0px; border-color: rgb(10, 179, 156); border-style: solid; border-width: 1px; padding: 0.5rem 0.9rem;\" onmouseover=\"this.style.background='#099885'\" onmouseout=\"this.style.background='#0ab39c'\">%OTP%</a></td>\n                                        </tr>\n\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                                If you received this email by mistake, simply delete it.\n                                            </td>\n                                        </tr>\n                                    </tbody></table>\n                                </td>\n                            </tr>\n                        </tbody></table>\n                        <div style=\"text-align: center; margin: 0px auto;\">\n                            <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                                <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SPPORT_PHONE%\" style=\"color: #495057;\">%SPPORT_PHONE%</a>\n                                </li>-->\n                            </ul>\n                            <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody></table>"
        }, {
            "unique": "NEW PASSWORD",
            "title": "New Password",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n            <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n                <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                    <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                            <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                                <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                    <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                                <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                    <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                                New Password\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; color: #878a99; line-height: 1.5; box-sizing: border-box; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\">\n                                                Please don't forgot to update your password after login &amp; don't share it with anyone.\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" itemprop=\"handler\" itemscope=\"\" itemtype=\"http://schema.org/HttpActionHandler\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\"><a href=\"javascript:void(0);\" itemprop=\"url\" style=\"font-family: Roboto, sans-serif; box-sizing: border-box; font-size: 0.8125rem; font-weight: 400; color: rgb(255, 255, 255); text-decoration: none; text-align: center; cursor: pointer; display: inline-block; border-radius: 0.25rem; text-transform: capitalize; background: rgb(10, 179, 156); margin: 0px; border-color: rgb(10, 179, 156); border-style: solid; border-width: 1px; padding: 0.5rem 0.9rem;\" onmouseover=\"this.style.background='#099885'\" onmouseout=\"this.style.background='#0ab39c'\">%PASSWORD%</a></td>\n                                        </tr>\n\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                                If you received this email by mistake, simply delete it.\n                                            </td>\n                                        </tr>\n                                    </tbody></table>\n                                </td>\n                            </tr>\n                        </tbody></table>\n                        <div style=\"text-align: center; margin: 0px auto;\">\n                            <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                                <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SPPORT_PHONE%\" style=\"color: #495057;\">%SPPORT_PHONE%</a>\n                                </li>-->\n                            </ul>\n                            <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody></table>"
        }, {
            "unique": "BOOKING",
            "title": "Congratulations on your Booking!",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n            <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n                <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                    <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                            <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                                <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                    <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                                <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                    <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                                Congratulations on your Booking! <br>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                                Dear %NAME%, <br>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                It has always been our endeavor to provide the best services to our customers. Staying true to this philosophy we have created an online system where you will be able to track the status of your documentation registration i.e. ATS &amp; Deed of Sale. Upon registration you will also be able to view the registered documents online.<br><br>\n                                                \n                                                Your login details are as follows: <br><br>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                                URL: <a href=\"%FRONT_URL%\">%FRONT_URL%</a><br>\n                                                Username: %USERNAME%<br>\n                                                Password: %PASSWORD%</td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                You can reach out to us on %SPPORT_PHONE% for assistance. We thank you for giving us an opportunity to make your dreams\n                                                come true. We look forward to serving you.<br>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                Warm Regards,<br>%BUILDER_FIRM%</td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                If you received this email by mistake, simply delete it.\n                                            </td>\n                                        </tr>\n                                    </tbody></table>\n                                </td>\n                            </tr>\n                        </tbody></table>\n                        <div style=\"text-align: center; margin: 0px auto;\">\n                            <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                                <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                            </ul>\n                            <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody></table>",
        }, {
            "unique": "ATTACHMENT",
            "title": "ATTACHMENT",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n            <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n                <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                    <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                            <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                                <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                    <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                                <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                    <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                                Attachments\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; color: #878a99; line-height: 1.5; box-sizing: border-box; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\">%BODY%.\n                                            </td>\n                                        </tr>\n                                       \n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                                If you received this email by mistake, simply delete it.\n                                            </td>\n                                        </tr>\n                                    </tbody></table>\n                                </td>\n                            </tr>\n                        </tbody></table>\n                        <div style=\"text-align: center; margin: 0px auto;\">\n                            <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                                <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                            </ul>\n                            <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%&gt;</p>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody></table>",
        }, {
            "unique": "INVOICE",
            "title": "%NAME%",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n            <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n                <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                    <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                        <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                            <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                                <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                    <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                                <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                    <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                                </div>\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                                Attachments\n                                            </td>\n                                        </tr>\n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                            <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; color: #878a99; line-height: 1.5; box-sizing: border-box; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 24px; text-align: center;\" valign=\"top\">%BODY%.\n                                            </td>\n                                        </tr>\n                                       \n                                        <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                            <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                                For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                                If you received this email by mistake, simply delete it.\n                                            </td>\n                                        </tr>\n                                    </tbody></table>\n                                </td>\n                            </tr>\n                        </tbody></table>\n                        <div style=\"text-align: center; margin: 0px auto;\">\n                            <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                                <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                            </ul>\n                            <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%&gt;</p>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody></table>"
        }, {
            "unique": "DOCUMENT",
            "title": "Registered %TEMPLATE% Uploaded Online!",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n            <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n            <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                    <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                            <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                            <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                            </div>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                            Registered %TEMPLATE% Uploaded Online! <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            Dear %NAME%, <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">Congratulations! Your %TEMPLATE% for unit number:%UNIT_NO% has been uploaded on portal and is\n                                            ready for your review. Please review It!<br><br></td></tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            You can reach out to us on %SPPORT_PHONE% for assistance. We thank you\n                                                for giving us an opportunity to make your dreams\n                                                come true. We look forward to serving you.<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Warm Regards,<br>\n                                            Team Client Connect\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            If you received this email by mistake, simply delete it.\n                                        </td>\n                                    </tr>\n                                </tbody></table>\n                            </td>\n                        </tr>\n                    </tbody></table>\n                    <div style=\"text-align: center; margin: 0px auto;\">\n                        <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                            <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                        </ul>\n                        <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tbody></table>",
        }, {
            "unique": "BANK DOCUMENT",
            "title": "%TEMPLATE% Attached - %NAME%,",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n            <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n            <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                    <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                            <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                            <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                            </div>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            Dear Sir/Madam, <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Thank you for connecting with %COMPANY%.<br><br>Please find attached the %TEMPLATE% for %NAME%, involving an amount of Rs %AMOUNT%. %SENDED_BY% drafted this deed.<br><br></td></tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            For assistance contact our support team @ %SPPORT_PHONE%.<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Warm Regards,<br>\n                                            Team Client Connect\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            If you received this email by mistake, simply delete it.\n                                        </td>\n                                    </tr>\n                                </tbody></table>\n                            </td>\n                        </tr>\n                    </tbody></table>\n                    <div style=\"text-align: center; margin: 0px auto;\">\n                        <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                            <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                        </ul>\n                        <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tbody></table>",
        },{
            "unique": "ADVOCATE START GENERATE",
            "title": "Your %TEMPLATE% is being processed!",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n            <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n            <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                    <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                            <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                            <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                            </div>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                            Your %TEMPLATE% is being processed! <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            Dear %NAME%, <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: rgb(135, 138, 153); text-align: left; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0px; padding: 15px 0px 0px;\" valign=\"top\">Your %TEMPLATE is being processed and is ready for your signature. We will give you a call to schedule a convenient time.<br><span style=\"font-family: Roboto, sans-serif;\"><br>\n                                        </span></td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            URL: <a href=\"%FRONT_URL%\">%FRONT_URL%</a><br>\n                                            Username: %USERNAME%</td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            You can reach out to us on %SPPORT_PHONE% for assistance. We thank you\n                                                for giving us an opportunity to make your dreams\n                                                come true. We look forward to serving you.<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Warm Regards,<br>\n                                            Team Client Connect\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            If you received this email by mistake, simply delete it.\n                                        </td>\n                                    </tr>\n                                </tbody></table>\n                            </td>\n                        </tr>\n                    </tbody></table>\n                    <div style=\"text-align: center; margin: 0px auto;\">\n                        <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                            <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                        </ul>\n                        <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tbody></table>",
        }, {
            "unique": "BUILDER REQUEST",
            "title": "Request for %TEMPLATE%!",
            "content": "<table class=\"body-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n        <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n            <td style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n            <td class=\"container\" width=\"600\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;\" valign=\"top\">\n                <div class=\"content\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n                    <table class=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n                        <tbody><tr style=\"font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;\">\n                            <td class=\"content-wrap\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06);border: 1px solid;border-radius: 7px; background-color: #fff;\" valign=\"top\">\n                                <meta itemprop=\"name\" content=\"Confirm Email\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                    <tbody><tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n                                            <div style=\"text-align: center;margin-bottom: 15px;\">\n                                                <img src=\"%API_URL%logo/logo-color.png\" alt=\"\" height=\"23\">\n                                            </div>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: center; font-weight: 500;\" valign=\"top\">\n                                            Request for %TEMPLATE%! <br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\">\n                                        <td class=\"content-block\" style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; line-height: 1.5; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px;text-align: left; font-weight: 500;\" valign=\"top\">\n                                            Dear team,<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: rgb(135, 138, 153); text-align: left; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0px; padding: 15px 0px 0px;\" valign=\"top\">We have received a new request to process %TEMPLATE%: %BUILDER%-%UNIT_NO%.<br><br></td></tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            You can reach out to us on %SPPORT_PHONE% for assistance. We thank you\n                                                for giving us an opportunity to make your dreams\n                                                come true. We look forward to serving you.<br>\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: left;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            Warm Regards,<br>\n                                            Team Client Connect\n                                        </td>\n                                    </tr>\n                                    <tr style=\"font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; border-top: 1px solid #e9ebec;\">\n                                        <td class=\"content-block\" style=\"color: #878a99; text-align: center;font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0; padding-top: 15px\" valign=\"top\">\n                                            If you received this email by mistake, simply delete it.\n                                        </td>\n                                    </tr>\n                                </tbody></table>\n                            </td>\n                        </tr>\n                    </tbody></table>\n                    <div style=\"text-align: center; margin: 0px auto;\">\n                        <ul style=\"list-style: none;display: flex; justify-content: space-evenly; padding-top: 25px;margin-bottom: 20px; padding-left: 0px; font-family: 'Roboto', sans-serif;\">\n                            <!-- <li>\n                                    <a href=\"%FRONT_URL%\" style=\"color: #495057;\">Help Center</a>\n                                </li>\n                                <li>\n                                    <a href=\"mailto:%SUPPORT_EMAIL%\" style=\"color: #495057;\">%SUPPORT_EMAIL%</a>\n                                </li>\n                                <li>\n                                    <a href=\"tel:%SUPPORT_PHONE%\" style=\"color: #495057;\">%SUPPORT_PHONE%</a>\n                                </li>-->\n                        </ul>\n                        <p style=\"font-family: 'Roboto', sans-serif; font-size: 14px;color: #98a6ad; margin: 0px;\">%COMPANY%. Design &amp; Develop by %DESIGN_BY%</p>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tbody></table>",
        }]);
    }
    // const TemplateKeys = require('./app/models/TemplateKeys');
    // let templateKeys = await TemplateKeys.findOne({});
    // if (!templateKeys){
    //     await TemplateKeys.create([
    //     {
    //         "name": "LOAN_AMOUNT",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "amount",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_DAY_NAME",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "dayname",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_DAY_NUMBER",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "day",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_MONTH_NAME",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "monthname",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_MONTH_NUMBER",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "month",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_YEAR",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "year",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "CUR_DATE",
    //         "defaultValue": "",
    //         "type": "Text",
    //         "description": "",
    //         "speciality": "date",
    //         "isDelete": false,
    //         "isEditable": true
    //     },
    //     {
    //         "name": "PAYMENT_ALL",
    //         "defaultValue": [
    //             {
    //                 "DATE": "",
    //                 "AMOUNT": "",
    //                 "AMOUNT_IN_WORDS": "",
    //                 "PAY_TYPE": "",
    //                 "REF_NO": "",
    //                 "BANK": "",
    //                 "BRANCH": "",
    //                 "CITY": "",
    //                 "COMMENTS": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "DATE": "text",
    //             "AMOUNT": "amount",
    //             "AMOUNT_IN_WORDS": "words",
    //             "PAY_TYPE": "text",
    //             "REF_NO": "text",
    //             "BANK": "text",
    //             "BRANCH": "text",
    //             "CITY": "text",
    //             "COMMENTS": "text"
    //         },
    //         "isDelete": false,
    //         "isEditable": true,
    //         "headers": {
    //             "DATE": {
    //                 "English": "Date",
    //                 "Gujarati": "તારીખ",
    //                 "Hindi": "तारीख",
    //             },
    //             "AMOUNT": {
    //                 "English": "Amount",
    //                 "Gujarati": "રકમ",
    //                 "Hindi": "राशि",
    //             },
    //             "AMOUNT_IN_WORDS": {
    //                 "English": "Amount In Words",
    //                 "Gujarati": "શબ્દોમાં રકમ",
    //                 "Hindi": "राशि शब्दों में"
    //             },
    //             "PAY_TYPE": {
    //                 "English": "Payment Type",
    //                 "Gujarati": "ચુકવણીનો પ્રકાર",
    //                 "Hindi": "भुगतान प्रकार"
    //             },
    //             "REF_NO": {
    //                 "English": "Ref. No.",
    //                 "Gujarati": "સંદર્ભ ના.",
    //                 "Hindi": "संदर्भ। संख्या"
    //             },
    //             "BANK": {
    //                 "English": "Bank",
    //                 "Gujarati": "બેંક",
    //                 "Hindi": "किनारा"
    //             },
    //             "BRANCH": {
    //                 "English": "Branch",
    //                 "Gujarati": "શાખા",
    //                 "Hindi": "शाखा"
    //             },
    //             "CITY": {
    //                 "English": "City",
    //                 "Gujarati": "શહેર",
    //                 "Hindi": "शहर"
    //             },
    //             "COMMENTS": {
    //                 "English": "Remark",
    //                 "Gujarati": "ટિપ્પણી",
    //                 "Hindi": "टिप्पणी"
    //             }
    //         },
    //         "isHeaders": true,
    //         "speciality": ""
    //     },
    //     {
    //         "name": "WITNESS_ALL",
    //         "defaultValue": [
    //             {
    //                 "WITNESS": "",
    //                 "WITNESS_ADDRESS": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "WITNESS": "text",
    //             "WITNESS_ADDRESS": "text"
    //         },
    //         "speciality": "",
    //         "isDelete": false,
    //         "isEditable": true
    //     }, 
    //     {
    //         "name": "TOPUP_LOAN_AMOUNT",
    //         "defaultValue": [
    //             {
    //                 "TOPUP_LOAN_AMOUNT": "",
    //                 "NO": "",
    //                 "ICICI BANK LTD": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "TOPUP_LOAN_AMOUNT": "text",
    //             "NO": "text",
    //             "ICICI BANK LTD": "text"
    //         },
    //         "speciality": "",
    //         "portal": "Bank",
    //         "isDelete": false,
    //         "isHeaders": true,
    //         "isEditable": true,
    //         "headers": {
    //             "TOPUP_LOAN_AMOUNT": {
    //                 "English": "Amounts of secured facilities (Rs. in mn.)",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "NO": {
    //                 "English": "Sr.No.",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "ICICI BANK LTD": {
    //                 "English": "Name(s) of the bank(s)/instn(s).",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             }
    //         }
    //     }, {
    //         "name": "LOAN_AMOUNT_TABLE",
    //         "defaultValue": [
    //             {
    //                 "NO": "",
    //                 "ICICI BANK LTD": "",
    //                 "LOAN_AMOUNT": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "NO": "text",
    //             "ICICI BANK LTD": "text",
    //             "LOAN_AMOUNT": "text"
    //         },
    //         "speciality": "",
    //         "portal": "Bank",
    //         "isDelete": false,
    //         "isHeaders": true,
    //         "headers": {
    //             "NO": {
    //                 "English": "Sr.No.",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "ICICI BANK LTD": {
    //                 "English": "Name(s) of the bank(s)/instn(s).",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "LOAN_AMOUNT": {
    //                 "English": "Amounts of secured facilities (Rs.)",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             }
    //         },
    //         "isEditable": true,
    //     }, {
    //         "name": "SCHEDULEIII",
    //         "defaultValue": [
    //             {
    //                 "AGREEMENT_DATE": "",
    //                 "INDIABULLS HOUSING FINANCE LTD": "",
    //                 "GIVER": "",
    //                 "Co_Giver": "",
    //                 "LOAN_AMOUNT": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "AGREEMENT_DATE": "text",
    //             "INDIABULLS HOUSING FINANCE LTD": "text",
    //             "GIVER": "text",
    //             "Co_Giver": "text",
    //             "LOAN_AMOUNT": "text"
    //         },
    //         "speciality": "",
    //         "portal": "Bank",
    //         "isDelete": false,
    //         "isHeaders": true,
    //         "headers": {
    //             "AGREEMENT_DATE": {
    //                 "English": "Loan Agreement(s) Date"
    //             },
    //             "INDIABULLS HOUSING FINANCE LTD": {
    //                 "English": "Name of the  Lender",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "GIVER": {
    //                 "English": "Name of the  Borrower (s)",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "Co_Giver": {
    //                 "English": "Name of the Co- Borrower(s)",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "LOAN_AMOUNT": {
    //                 "English": "Loan(s)  (Rs.)",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             }
    //         },
    //         "isEditable": true,
    //     }, {
    //         "name": "PROPERTY_TBL",
    //         "defaultValue": [
    //             {
    //                 "PROPERTY": "",
    //                 "LIST_OF_DOCUMENTS": ""
    //             }
    //         ],
    //         "type": "Table",
    //         "description": {
    //             "PROPERTY": "text",
    //             "LIST_OF_DOCUMENTS": "text"
    //         },
    //         "speciality": "file",
    //         "portal": "Bank",
    //         "isDelete": false,
    //         "isHeaders": false,
    //         "isEditable": true,
    //         "headers": {
    //             "PROPERTY": {
    //                 "English": "",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             },
    //             "LIST_OF_DOCUMENTS": {
    //                 "English": "",
    //                 "Gujarati": "",
    //                 "Hindi": ""
    //             }
    //         },
    //         "isCopyPaste": true
    //     }])
    // }
    

}
init()