import { StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from './theme';

export default StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.bgSecondary,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // ── Header ──
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      Spacing.lg,
    marginBottom:   Spacing.xs,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  logoCircle: {
    width:          48,
    height:         48,
    borderRadius:   24,
    backgroundColor: Colors.teal,
    alignItems:     'center',
    justifyContent: 'center',
    ...Shadow.teal,
  },
  logoTitle: {
    fontSize:    FontSize.lg,
    fontWeight:  '800',
    color:       Colors.navy,
    letterSpacing: 2,
    lineHeight:  18,
  },
  logoSub: {
    fontSize:    11,
    fontWeight:  '600',
    color:       Colors.teal,
    letterSpacing: 3,
    lineHeight:  14,
  },
  profileBtn: {
    width:          38,
    height:         38,
    borderRadius:   19,
    borderWidth:    1.5,
    borderColor:    Colors.tealLight,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgWhite,
  },
  tagline: {
    fontSize:           FontSize.sm,
    color:              Colors.teal,
    fontStyle:          'italic',
    textDecorationLine: 'underline',
    marginBottom:       Spacing.md,
  },

  // ── Banner ──
  banner: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.teal,
    borderRadius:    Radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom:    Spacing.md,
  },
  bannerDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: '#6EE7B7',
    marginRight:     Spacing.sm,
  },
  bannerText: {
    color:      '#fff',
    fontSize:   FontSize.sm,
    fontWeight: '600',
  },

  // ── Search Card ──
  searchCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius:    Radius.lg,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginBottom:    Spacing.sm,
    position:        'relative',
    ...Shadow.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  inputDivider: {
    width:           1,
    height:          18,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  input: {
    flex:       1,
    fontSize:   FontSize.md,
    color:      Colors.navy,
    fontWeight: '500',
  },
  inputSep: {
    height:          1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },
  swapBtn: {
    position:        'absolute',
    right:           14,
    top:             '50%',
    marginTop:       -16,
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: Colors.tealLight,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // ── Search Button ──
  searchBtn: {
    backgroundColor: Colors.teal,
    borderRadius:    Radius.md,
    paddingVertical: Spacing.md,
    alignItems:      'center',
    marginBottom:    Spacing.md,
    ...Shadow.teal,
  },
  searchBtnText: {
    color:      '#fff',
    fontSize:   FontSize.md,
    fontWeight: '700',
  },

  // ── Chips ──
  chips: {
    gap:          Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.teal,
    borderRadius:      Radius.sm,
    paddingVertical:   9,
    paddingHorizontal: Spacing.md,
  },
  chipText:     { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm },
  chipTextBold: { color: '#fff', fontWeight: '700' },

  // ── Divider ──
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle:       'dashed',
    marginVertical:    Spacing.md,
  },

  // ── Quick Actions ──
  quickActions: {
    flexDirection:   'row',
    backgroundColor: Colors.bgWhite,
    borderRadius:    Radius.lg,
    overflow:        'hidden',
    marginBottom:    Spacing.md,
    ...Shadow.sm,
  },
  quickBtn: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap:            6,
  },
  quickBtnDivider: {
    width:           1,
    backgroundColor: Colors.borderLight,
    marginVertical:  12,
  },
  quickBtnLabel: {
    fontSize:   FontSize.sm,
    color:      Colors.navy,
    fontWeight: '600',
  },

  // ── Section ──
  sectionTitle: {
    fontSize:     FontSize.lg,
    fontWeight:   '700',
    color:        Colors.navy,
    marginBottom: Spacing.sm,
  },

  // ── AI Result Banner ──
  aiBanner: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.tealLight,
    borderRadius:      Radius.md,
    padding:           Spacing.md,
    marginBottom:      Spacing.md,
    gap:               Spacing.sm,
  },
  aiBannerText: {
    flex:       1,
    fontSize:   FontSize.sm,
    color:      Colors.tealDark,
    fontWeight: '500',
    lineHeight: 18,
  },

  // ── Filter ──
  filterRow: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginBottom:  Spacing.md,
  },
  filterBtn: {
    paddingVertical:   7,
    paddingHorizontal: Spacing.md,
    borderRadius:      Radius.full,
    backgroundColor:   Colors.borderLight,
    borderWidth:       1,
    borderColor:       Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.teal,
    borderColor:     Colors.teal,
  },
  filterBtnText:       { fontSize: FontSize.sm, fontWeight: '600', color: Colors.slate },
  filterBtnTextActive: { color: '#fff' },

  // ── Route Card ──
  routeCard: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.bgWhite,
    borderRadius:      Radius.md,
    paddingVertical:   12,
    paddingHorizontal: Spacing.md,
    marginBottom:      Spacing.sm,
    gap:               Spacing.md,
    ...Shadow.sm,
  },
  routeBadge: {
    width:          44,
    height:         44,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
  },
  routeBadgeText: {
    color:         '#fff',
    fontWeight:    '800',
    fontSize:      FontSize.sm,
    letterSpacing: 0.5,
  },
  routeInfo:     { flex: 1 },
  routeName:     { fontSize: FontSize.md, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  routeMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  routeMetaText: { fontSize: FontSize.sm, color: Colors.slate },
  routeMetaDot:  { color: Colors.border, fontSize: FontSize.sm },
  viewMapBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   Colors.tealLight,
    paddingVertical:   7,
    paddingHorizontal: 10,
    borderRadius:      Radius.sm,
  },
  viewMapText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.tealDark },

  // ── No Route ──
  noRouteBanner: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.error,
    borderRadius:      Radius.sm,
    paddingVertical:   10,
    paddingHorizontal: Spacing.md,
    marginTop:         Spacing.xs,
  },
  noRouteText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },

  // ── Loading ──
  loadingWrap: {
    alignItems:   'center',
    paddingVertical: Spacing.xl,
    gap:          Spacing.sm,
  },
  loadingText: { fontSize: FontSize.sm, color: Colors.slate },
});