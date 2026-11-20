/* Listado de calculadoras para el menú. Para agregar una nueva:
   crear calc/<archivo>.html y sumar una entrada acá. */
window.FAC_CATEGORIES = [
  { id: 'riesgo', name: 'Riesgo cardiovascular', icon: '<path d="M12 21s-7-4.4-8.8-8.7C1.8 8.9 3.8 5.5 7 5.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.2 0 5.2 3.4 3.8 6.8C19 16.6 12 21 12 21z"/><path d="M8 13h2l1-2 2 4 1-2h2"/>' },
  { id: 'coronaria', name: 'Enfermedad coronaria', icon: '<path d="M3 12h4l2-5 3 10 2-5h7"/>' },
  { id: 'fa', name: 'Fibrilación auricular', icon: '<path d="M2 13h3l1-2 1 2 1-1 1 1 1-2 1 2 1-1 1 1h1l1.5-7 2 13 1.5-6H22"/>' },
  { id: 'ic', name: 'Insuficiencia cardíaca', icon: '<path d="M12 20s-7-4.3-8.8-8.6C1.8 8.2 3.8 5 7 5c2 0 3.4 1 5 3 1.6-2 3-3 5-3 3.2 0 5.2 3.2 3.8 6.4C19 15.7 12 20 12 20z"/>' },
  { id: 'metab', name: 'Cardiometabolismo', icon: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>' },
  { id: 'tep', name: 'Tromboembolismo pulmonar', icon: '<path d="M12 3v8m0 0-3 3m3-3 3 3"/><path d="M9 7.5C6 8 3.5 12 3.5 16.5c0 2 1 3.5 3 3.5S9 18.5 9 16V7.5zM15 7.5c3 .5 5.5 4.5 5.5 9 0 2-1 3.5-3 3.5S15 18.5 15 16V7.5z"/>' },
  { id: 'cirugia', name: 'Riesgo quirúrgico', icon: '<path d="M14.5 3.5 20.5 9.5 9 21H3v-6z"/><path d="m12 6 6 6"/>' },
  { id: 'otros', name: 'Otros', icon: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 14h9"/>' }
];

window.FAC_CALCS = [
  { cat: 'riesgo', file: 'prevent.html', title: 'PREVENT (AHA)', desc: 'Riesgo a 10 años de enfermedad CV total, ASCVD e insuficiencia cardíaca.', kw: 'prevent aha ascvd prevencion primaria riesgo cardiovascular americano' },
  { cat: 'riesgo', file: 'score2.html', title: 'SCORE2 / SCORE2-LAC', desc: 'Riesgo CV a 10 años: versión Latinoamérica (SCORE2-LAC) y europea (SCORE2 / SCORE2-OP).', kw: 'score2 score2-op europeo esc prevencion primaria riesgo cardiovascular lac panamericano' },
  { cat: 'riesgo', file: 'score2-diabetes.html', title: 'SCORE2-Diabetes', desc: 'Riesgo CV a 10 años en diabetes tipo 2, de 40 a 69 años (ESC 2023).', kw: 'score2 diabetes dbt europeo esc riesgo cardiovascular' },
  { cat: 'riesgo', file: 'pce.html', title: 'ASCVD (Pooled Cohort Equations)', desc: 'Riesgo ASCVD a 10 años ACC/AHA 2013, de 40 a 79 años.', kw: 'pce pooled cohort ascvd acc aha 2013 riesgo cardiovascular estatinas' },
  { cat: 'riesgo', file: 'framingham.html', title: 'Framingham', desc: 'Riesgo cardiovascular general a 10 años y edad vascular.', kw: 'framingham dagostino edad vascular riesgo cardiovascular' },
  { cat: 'coronaria', file: 'grace.html', title: 'GRACE', desc: 'Mortalidad intrahospitalaria en síndrome coronario agudo.', kw: 'sca iam scasest iamcest riesgo isquemico' },
  { cat: 'coronaria', file: 'heart.html', title: 'HEART', desc: 'Dolor torácico en guardia: riesgo de eventos a 6 semanas.', kw: 'dolor toracico guardia emergencia mace' },
  { cat: 'coronaria', file: 'timi-iamcest.html', title: 'TIMI (IAMCEST)', desc: 'Mortalidad a 30 días en infarto con elevación del ST.', kw: 'stemi supra st' },
  { cat: 'coronaria', file: 'timi-scasest.html', title: 'TIMI (SCASEST)', desc: 'Eventos a 14 días en angina inestable / IAM sin elevación del ST.', kw: 'nstemi angina inestable' },
  { cat: 'coronaria', file: 'crusade.html', title: 'CRUSADE', desc: 'Riesgo de sangrado mayor intrahospitalario en SCA.', kw: 'sangrado hemorragia' },
  { cat: 'coronaria', file: 'killip.html', title: 'Killip-Kimball', desc: 'Clasificación clínica de insuficiencia cardíaca en el IAM.', kw: 'kimball shock edema' },
  { cat: 'coronaria', file: 'zwolle.html', title: 'Zwolle', desc: 'Identifica pacientes con IAMCEST aptos para alta temprana post-angioplastia.', kw: 'alta temprana angioplastia primaria' },
  { cat: 'coronaria', file: 'arc-hbr.html', title: 'ARC-HBR', desc: 'Criterios de alto riesgo de sangrado en pacientes con ICP.', kw: 'sangrado angioplastia stent' },
  { cat: 'coronaria', file: 'precise-dapt.html', title: 'PRECISE-DAPT', desc: 'Riesgo de sangrado con doble antiagregación: duración de DAPT.', kw: 'sangrado doble antiagregacion dapt' },
  { cat: 'coronaria', file: 'dapt.html', title: 'DAPT', desc: 'Beneficio vs. riesgo de prolongar la doble antiagregación más de 12 meses.', kw: 'doble antiagregacion prolongada' },
  { cat: 'fa', file: 'cha2ds2-va.html', title: 'CHA₂DS₂-VA', desc: 'Riesgo de ACV en FA e indicación de anticoagulación (ESC 2024).', kw: 'cha2ds2va chads vasc acv anticoagulacion' },
  { cat: 'fa', file: 'has-bled.html', title: 'HAS-BLED', desc: 'Riesgo de sangrado mayor en pacientes anticoagulados.', kw: 'hasbled sangrado anticoagulacion' },
  { cat: 'ic', file: 'indice-cardiaco.html', title: 'Índice cardíaco', desc: 'Gasto cardíaco ajustado por superficie corporal.', kw: 'gasto cardiaco superficie corporal hemodinamia' },
  { cat: 'ic', file: 'h2fpef.html', title: 'H₂FPEF', desc: 'Probabilidad de insuficiencia cardíaca con FE preservada.', kw: 'h2fpef icfep hfpef disnea' },
  { cat: 'metab', file: 'imc.html', title: 'Índice de masa corporal', desc: 'IMC y categoría según OMS.', kw: 'imc bmi obesidad peso' },
  { cat: 'metab', file: 'ict.html', title: 'Índice cintura-talla', desc: 'Adiposidad central y riesgo cardiometabólico.', kw: 'ict cintura talla obesidad abdominal' },
  { cat: 'metab', file: 'ldl-friedewald.html', title: 'LDL (Friedewald)', desc: 'Colesterol LDL calculado y no-HDL.', kw: 'ldl colesterol lipidos friedewald' },
  { cat: 'metab', file: 'tyg.html', title: 'Índice TyG', desc: 'Triglicéridos-glucosa: marcador de insulinorresistencia.', kw: 'tyg trigliceridos glucosa insulinorresistencia' },
  { cat: 'metab', file: 'fib4.html', title: 'FIB-4', desc: 'Fibrosis hepática en enfermedad hepática metabólica (MASLD).', kw: 'fib4 higado fibrosis masld hepatico' },
  { cat: 'tep', file: 'ginebra.html', title: 'Ginebra revisado', desc: 'Probabilidad clínica pretest de TEP.', kw: 'geneva ginebra tep embolia' },
  { cat: 'tep', file: 'wells.html', title: 'Wells (TEP)', desc: 'Probabilidad clínica pretest de TEP.', kw: 'wells tep embolia' },
  { cat: 'tep', file: 'pesi.html', title: 'PESI', desc: 'Mortalidad a 30 días en TEP confirmado.', kw: 'pesi tep embolia pronostico' },
  { cat: 'tep', file: 'spesi.html', title: 'PESI simplificado', desc: 'Versión simplificada del PESI (sPESI).', kw: 'spesi tep embolia pronostico' },
  { cat: 'cirugia', file: 'euroscore2.html', title: 'EuroSCORE II', desc: 'Mortalidad operatoria en cirugía cardíaca del adulto.', kw: 'euroscore euro score cirugia cardiaca mortalidad operatoria quirurgico' },
  { cat: 'cirugia', file: 'argenscore.html', title: 'ArgenSCORE', desc: 'Score latinoamericano de mortalidad en cirugía cardíaca.', kw: 'argenscore argentino cirugia cardiaca mortalidad quirurgico' },
  { cat: 'cirugia', url: 'https://acsdriskcalc.research.sts.org/', title: 'STS Risk Calculator', desc: 'Calculadora oficial de la Society of Thoracic Surgeons (CRM y cirugía valvular).', kw: 'sts society thoracic surgeons cirugia cardiaca prom mortalidad quirurgico' },
  { cat: 'otros', file: 'ckd-epi.html', title: 'Filtrado glomerular (CKD-EPI)', desc: 'TFG estimada CKD-EPI 2021 y clearance de Cockcroft-Gault.', kw: 'clearance creatinina renal tfg ckd epi cockcroft' }
];
