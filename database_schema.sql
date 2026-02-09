--
-- PostgreSQL database dump
--

\restrict 0LmuaO4VHywwTahDrroHtihRK5tGVcxAww4qFlx7LCscPPiQ3iS1TIAGhuLdhbS

-- Dumped from database version 17.7 (Homebrew)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    slot_id integer,
    student_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    km_driven numeric DEFAULT 0,
    grade character varying(50),
    instructor_notes text,
    status character varying(50) DEFAULT 'scheduled'::character varying,
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['scheduled'::character varying, 'completed'::character varying, 'missed'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO harshalbaviskar;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO harshalbaviskar;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: fuel_logs; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.fuel_logs (
    id integer NOT NULL,
    vehicle_id integer,
    date date NOT NULL,
    liters numeric(5,2) NOT NULL,
    cost_per_liter numeric(5,2) NOT NULL,
    total_cost numeric(7,2) NOT NULL,
    odometer_reading integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fuel_logs OWNER TO harshalbaviskar;

--
-- Name: fuel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.fuel_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_logs_id_seq OWNER TO harshalbaviskar;

--
-- Name: fuel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.fuel_logs_id_seq OWNED BY public.fuel_logs.id;


--
-- Name: license_applications; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.license_applications (
    id integer NOT NULL,
    student_id integer,
    status character varying(50) DEFAULT 'applied'::character varying NOT NULL,
    student_details jsonb DEFAULT '{}'::jsonb,
    license_number character varying(50),
    certificate_issued_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.license_applications OWNER TO harshalbaviskar;

--
-- Name: license_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.license_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.license_applications_id_seq OWNER TO harshalbaviskar;

--
-- Name: license_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.license_applications_id_seq OWNED BY public.license_applications.id;


--
-- Name: maintenance_logs; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.maintenance_logs (
    id integer NOT NULL,
    vehicle_id integer,
    date date NOT NULL,
    service_type character varying(100) NOT NULL,
    cost numeric(7,2) NOT NULL,
    description text,
    garage_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_logs OWNER TO harshalbaviskar;

--
-- Name: maintenance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.maintenance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_logs_id_seq OWNER TO harshalbaviskar;

--
-- Name: maintenance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.maintenance_logs_id_seq OWNED BY public.maintenance_logs.id;


--
-- Name: slots; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.slots (
    id integer NOT NULL,
    instructor_id integer,
    student_id integer,
    start_time timestamp with time zone NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    max_students integer DEFAULT 4,
    booked_count integer DEFAULT 0,
    CONSTRAINT slots_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'booked'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.slots OWNER TO harshalbaviskar;

--
-- Name: slots_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slots_id_seq OWNER TO harshalbaviskar;

--
-- Name: slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.slots_id_seq OWNED BY public.slots.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['instructor'::character varying, 'student'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO harshalbaviskar;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO harshalbaviskar;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: harshalbaviskar
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    instructor_id integer,
    make character varying(50) NOT NULL,
    model character varying(50) NOT NULL,
    year integer NOT NULL,
    plate_number character varying(20) NOT NULL,
    image_url text,
    last_service_date date,
    next_service_due_date date,
    insurance_expiry_date date,
    road_tax_expiry_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicles OWNER TO harshalbaviskar;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: harshalbaviskar
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO harshalbaviskar;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: harshalbaviskar
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: fuel_logs id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.fuel_logs ALTER COLUMN id SET DEFAULT nextval('public.fuel_logs_id_seq'::regclass);


--
-- Name: license_applications id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.license_applications ALTER COLUMN id SET DEFAULT nextval('public.license_applications_id_seq'::regclass);


--
-- Name: maintenance_logs id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.maintenance_logs ALTER COLUMN id SET DEFAULT nextval('public.maintenance_logs_id_seq'::regclass);


--
-- Name: slots id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.slots ALTER COLUMN id SET DEFAULT nextval('public.slots_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_slot_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_id_student_id_key UNIQUE (slot_id, student_id);


--
-- Name: fuel_logs fuel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.fuel_logs
    ADD CONSTRAINT fuel_logs_pkey PRIMARY KEY (id);


--
-- Name: license_applications license_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.license_applications
    ADD CONSTRAINT license_applications_pkey PRIMARY KEY (id);


--
-- Name: maintenance_logs maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_pkey PRIMARY KEY (id);


--
-- Name: slots slots_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: idx_license_student; Type: INDEX; Schema: public; Owner: harshalbaviskar
--

CREATE UNIQUE INDEX idx_license_student ON public.license_applications USING btree (student_id);


--
-- Name: bookings bookings_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.slots(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fuel_logs fuel_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.fuel_logs
    ADD CONSTRAINT fuel_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: license_applications license_applications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.license_applications
    ADD CONSTRAINT license_applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: maintenance_logs maintenance_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: slots slots_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: slots slots_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.slots
    ADD CONSTRAINT slots_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: vehicles vehicles_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: harshalbaviskar
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0LmuaO4VHywwTahDrroHtihRK5tGVcxAww4qFlx7LCscPPiQ3iS1TIAGhuLdhbS

